import { Projet } from '@/domain/models/projet';
import { Aide } from '@/domain/models/aide';
import { AideScore } from '@/domain/models/aide-score';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';

export interface AideScoringServiceInterface {
  attribuerScore(aide: Aide, projet: Projet): Promise<number>;
  evaluerAides(aides: Aide[], projet: Projet): Promise<AideEvaluee[]>;
  aideScore(aide: Aide, projet: Projet): Promise<AideScore>;
  aidesScores(aides: Aide[], projet: Projet): Promise<AideScore[]>;
  initialize(): Promise<void>;
}
