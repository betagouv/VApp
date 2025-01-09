import * as console from 'node:console';
import { GenerateRequest } from 'ollama';
import { AideScoringServiceInterface } from '@/domain/services/aide-scoring-service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { getAssistantConfiguration, ollama } from '@/infra/ai/ollama';
import { system, user } from '@/infra/ai/prompts/scoring';
import { envNumber } from '@/infra/repositories/at-aide-repository';
import { AbstractOllamaService } from '@/infra/ai/services/abstract-ollama-service';
import { AideScore } from '@/domain/models/aide-score';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';

export class AideScoringService extends AbstractOllamaService implements AideScoringServiceInterface {
  static SCORING_MAX_SEED = envNumber(
    process.env.MIN_NB_SCORES_REQUIRED,
    envNumber(process.env.NOTATION_MAX_SEED, envNumber(process.env.SCORING_MAX_SEED, 3))
  );
  static MAX_ATTEMPT = 6;
  static EXTRACT_SCORE_REGEX = /(-? ?[0-9]+).*/;

  public async attribuerScore(aide: Aide, projet: Projet): Promise<number> {
    const aideScore = projet.aidesScores.get(aide.uuid);
    if (aideScore !== undefined) {
      return Promise.resolve(aideScore.scoreCompatibilite);
    }

    if (!this.initialized) {
      await this.initialize();
    }

    const scores: number[] = [];
    let attempt = 0;
    for (
      attempt;
      attempt < AideScoringService.MAX_ATTEMPT && scores.length < AideScoringService.SCORING_MAX_SEED;
      attempt++
    ) {
      const score = await this.attemptAttribuerScore(aide, projet, attempt);
      if (AideScore.isScore(score)) {
        scores.push(score);
      }
    }

    if (scores.length < AideScoringService.SCORING_MAX_SEED) {
      throw new Error(
        `Malgrès ${attempt} tentatives, seulement ${scores.length} scores sur les ${AideScoringService.SCORING_MAX_SEED} requises pour l'aide "${aide.nom}" portant l'uuid ${aide.uuid}.`
      );
    }

    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  private async attemptAttribuerScore(aide: Aide, projet: Projet, seed: number): Promise<number | null> {
    try {
      const generateRequest: GenerateRequest & {
        stream?: false;
      } = {
        model: this.assistantConfiguration.model,
        system,
        options: this.getRequestOptions({
          seed: seed
        }),
        prompt: user(aide, projet),
        stream: false
      };
      const { response } = await this.ollama.generate(generateRequest);

      const matches = response.trim().match(AideScoringService.EXTRACT_SCORE_REGEX);
      const score = matches ? Number(matches[1]) : null;
      AideScore.assertValid(score, `La réponse suivante n'est pas attribuable à une note: ${response}`);

      return Promise.resolve(score);
    } catch (e: unknown) {
      console.error(e);
      return Promise.resolve(null);
    }
  }

  public async aideScore(aide: Aide, projet: Projet): Promise<AideScore> {
    return new AideScore(await this.attribuerScore(aide, projet), aide.uuid);
  }

  public aidesScores(aides: Aide[], projet: Projet): Promise<AideScore[]> {
    return Promise.all(aides.map((aide) => this.aideScore(aide, projet)));
  }

  public evaluerAides(aides: Aide[], projet: Projet): Promise<AideEvaluee[]> {
    return Promise.all(
      aides.map(async (aide) => AideEvaluee.fromAideAndScore(aide, await this.attribuerScore(aide, projet)))
    );
  }
}

export const aideScoringService = new AideScoringService(ollama, getAssistantConfiguration('score-assistant'));
