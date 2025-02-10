import { AideScoringServiceInterface } from '@/domain/services/aide-scoring-service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';

export class RandomNotationAideService implements AideScoringServiceInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public attribuerScore(aide: Aide, projet: Projet) {
    return Promise.resolve(Math.floor(Math.random() * AideScore.MAX) + AideScore.MIN);
  }
  initialize(): Promise<void> {
    return Promise.resolve();
  }

  public async aideScore(aide: Aide, projet: Projet): Promise<AideScore> {
    return new AideScore(await this.attribuerScore(aide, projet), aide.id);
  }

  public aidesScores(aides: Aide[], projet: Projet): Promise<AideScore[]> {
    return Promise.all(aides.map((aide) => this.aideScore(aide, projet)));
  }

  evaluerAides(aides: Aide[], projet: Projet): Promise<AideEvaluee[]> {
    return Promise.all(
      aides.map(async (aide) => AideEvaluee.fromAideAndScore(aide, await this.attribuerScore(aide, projet)))
    );
  }
}

export const randomNotationAideService = new RandomNotationAideService();
