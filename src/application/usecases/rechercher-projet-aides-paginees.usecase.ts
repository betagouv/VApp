import { UsecaseInterface } from '@/application/usecases/usecase.interface';
import { AideScore } from '@/domain/models/aide-score';
import { AideEvalueeRepositoryInterface } from '@/domain/repositories/aide-evaluee-repository.interface';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { PaginatedResult, Pagination } from '@/libs/pagination';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';
import { Projet } from '@/domain/models/projet';

export type RechercherProjetAidesPagineesUsecaseInput = {
  projetId: Projet['uuid'];
  criteres: CriteresRechercheAide;
  page: Pagination['page'];
};

export class RechercherProjetAidesPagineesUsecase implements UsecaseInterface {
  public constructor(
    private readonly projetRepository: ProjetRepositoryInterface,
    private readonly aideEvalueeRepository: AideEvalueeRepositoryInterface
  ) {}

  public async execute({
    projetId,
    criteres,
    page
  }: RechercherProjetAidesPagineesUsecaseInput): Promise<PaginatedResult<AideEvaluee>> {
    const projet = await this.projetRepository.fromUuid(projetId);
    const aidesPaginees = await this.aideEvalueeRepository.findAllPaginatedForProjet(projet, criteres, {
      page,
      limit: AideScore.SELECTION
    });
    projet.updateScores(
      aidesPaginees.data.map(({ id: aideId, scoreCompatibilite }) => ({ aideId, scoreCompatibilite }))
    );

    await this.projetRepository.save(projet);

    return aidesPaginees;
  }
}
