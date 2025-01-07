import { GenerateRequest } from 'ollama';
import { NotationAideServiceInterface } from '@/domain/services/notation-aide-service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { assertValid, isNote } from '@/domain/note';
import { getAssistantConfiguration, ollama } from '@/infra/ai/ollama';
import { system, user } from '@/infra/ai/prompts/notation';
import { envNumber } from '@/infra/repositories/aide.repository';
import { AbstractOllamaService } from '@/infra/ai/services/abstract-ollama-service';

export class NotationAideService extends AbstractOllamaService implements NotationAideServiceInterface {
  static NOTATION_MAX_SEED = envNumber(process.env.MIN_NB_NOTES_REQUIRED, envNumber(process.env.NOTATION_MAX_SEED, 3));
  static MAX_ATTEMPT = 6;
  static EXTRACT_NOTE_REGEX = /(-? ?[0-9]+).*/;

  public async noterAide(aide: Aide, projet: Projet): Promise<number> {
    if (!this.initialized) {
      await this.initialize();
    }

    const notes = [];
    let attempt = 0;
    for (
      attempt;
      attempt < NotationAideService.MAX_ATTEMPT && notes.length < NotationAideService.NOTATION_MAX_SEED;
      attempt++
    ) {
      const note = await this.attemptNoterAide(aide, projet, attempt);
      if (isNote(note)) {
        notes.push(note);
      }
    }

    if (notes.length < NotationAideService.NOTATION_MAX_SEED) {
      throw new Error(
        `Malgrès ${attempt} tentatives, seulement ${notes.length} notes sur les ${NotationAideService.NOTATION_MAX_SEED} requises pour l'aide "${aide.nom}" portant l'uuid ${aide.uuid}.`
      );
    }

    return notes.reduce((a, b) => a + b, 0) / notes.length;
  }

  private async attemptNoterAide(aide: Aide, projet: Projet, seed: number): Promise<number | null> {
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

      const matches = response.trim().match(NotationAideService.EXTRACT_NOTE_REGEX);
      const note = matches ? Number(matches[1]) : null;
      assertValid(note, `La réponse suivante n'est pas attribuable à une note: ${response}`);

      return Promise.resolve(note);
    } catch (e: unknown) {
      console.error(e);
      return Promise.resolve(null);
    }
  }
}

export const notationAideService = new NotationAideService(ollama, getAssistantConfiguration('score-assistant'));
