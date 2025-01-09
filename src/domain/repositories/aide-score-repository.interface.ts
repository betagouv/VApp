import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

export interface AideScoreRepositoryInterface {
  findAllAsyncForProjet(
    projet: Projet,
    criteres?: CriteresRechercheAide,
    chunkSize?: number
  ): AsyncGenerator<AideScore, AideScore[]>;
}
