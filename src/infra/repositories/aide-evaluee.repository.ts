import { Pagination, PaginatedResult } from '@/libs/pagination';
import { Projet } from '@/domain/models/projet';
import { AideScoringServiceInterface } from '@/domain/services/aide-scoring-service.interface';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { AideEvalueeRepositoryInterface } from '@/domain/repositories/aide-evaluee-repository.interface';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { PageOutOfRangeError } from '@/application/errors/page-out-of-range.error';

export class AideEvalueeRepository implements AideEvalueeRepositoryInterface {
  public constructor(
    private readonly scoringAideService: AideScoringServiceInterface,
    private readonly aideRepository: AideRepositoryInterface
  ) {}

  async findAllPaginatedForProjet(
    projet: Projet,
    criteresRechercheAide: CriteresRechercheAide,
    { page, limit }: Pagination
  ): Promise<PaginatedResult<AideEvaluee>> {
    const currentPage = page || 1;
    const skip = (currentPage - 1) * limit;
    const aides = await this.aideRepository.findAllForProjet(projet, criteresRechercheAide);
    const lastPage = Math.ceil(aides.length / limit);
    if (currentPage > lastPage || currentPage < 1) {
      throw new PageOutOfRangeError(`Requested page ${currentPage} is outside of available pages range 1-${lastPage}.`);
    }

    const slicedAides = aides.slice(skip, skip + limit);
    const aidesEvaluees = await this.scoringAideService.evaluerAides(slicedAides, projet);

    return {
      data: aidesEvaluees,
      totalItems: aides.length,
      lastPage,
      currentPage
    };
  }
}
