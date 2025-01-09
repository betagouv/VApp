import { Pagination } from '@/libs/pagination/pagination';
import { PaginatedResult } from '@/libs/pagination/paginated-result';
import { Projet } from '@/domain/models/projet';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

export interface AideEvalueeRepositoryInterface {
  findAllPaginatedForProjet(
    projet: Projet,
    criteres: CriteresRechercheAide,
    pagination: Pagination
  ): Promise<PaginatedResult<AideEvaluee>>;
}
