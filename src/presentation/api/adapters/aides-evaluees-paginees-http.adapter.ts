import { CriteresRechercheAidesPagineesDto } from '@/presentation/api/dtos/criteres-recherche-aides.dto';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { PaginatedResult } from '@/libs/pagination';
import { JsonAPICollection } from '@/presentation/api/json-api/collection';
import { AideEvaluee } from '@/domain/models/aide/aide-evaluee';
import { RechercherProjetAidesPagineesUsecaseInput } from '@/application/usecases/rechercher-projet-aides-paginees.usecase';
import { Projet } from '@/domain/models/projet';

export class AidesEvalueesPagineesHttpAdapter {
  static toInput(
    projetId: string,
    criteresRechercheAidesPagineesDto: CriteresRechercheAidesPagineesDto
  ): RechercherProjetAidesPagineesUsecaseInput {
    const { payante, natures, actionsConcernees, page } = criteresRechercheAidesPagineesDto;

    return {
      projetId: projetId as Projet['uuid'],
      criteres: {
        payante,
        natures: natures || [AtAidTypeGroup.Financiere],
        actionsConcernees
      },
      page
    };
  }

  static toJsonAPICollection(
    aidesEvalueesPaginees: PaginatedResult<AideEvaluee>,
    requestedURL: URL
  ): JsonAPICollection<AideEvaluee> {
    return JsonAPICollection.fromPaginatedResult(aidesEvalueesPaginees, requestedURL);
  }
}
