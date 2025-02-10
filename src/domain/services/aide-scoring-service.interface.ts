import { Projet } from '@/domain/models/projet';
import { AideInterface } from '@/domain/models/aide.interface';
import { AideScore } from '@/domain/models/aide-score';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';

export interface AideScoringServiceInterface {
  attribuerScore(aide: AideInterface, projet: Projet): Promise<number>;
  evaluerAides(aides: AideInterface[], projet: Projet): Promise<AideEvaluee[]>;
  aideScore(aide: AideInterface, projet: Projet): Promise<AideScore>;
  aidesScores(aides: AideInterface[], projet: Projet): Promise<AideScore[]>;
  initialize(): Promise<void>;
}
