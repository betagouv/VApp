import {
  isViewAideEvaluee,
  ViewAideEvalueeDto,
  ViewPartialAideEvalueDto
} from '@/presentation/ui/dtos/view-aide-evaluee.dto';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { AideScore } from '@/domain/models/aide-score';

export class AideEvalueeAdapter {
  public constructor(public aideRepository: AideRepositoryInterface) {}

  async toViewAideCompatible({
    aideId,
    scoreCompatibilite,
    fournisseurDonnees
  }: AideScore): Promise<ViewAideEvalueeDto | ViewPartialAideEvalueDto> {
    if (fournisseurDonnees) {
    }

    const aide = await this.aideRepository.findOneById(aideId);
    if (aide) {
      return {
        aide: { ...aide },
        scoreCompatibilite,
        fournisseurDonnees
      };
    }

    return {
      aide: {
        id: aideId
      },
      scoreCompatibilite
    };
  }

  async toViewAidesEvalues(aidesScores: AideScore[]): Promise<ViewAideEvalueeDto[]> {
    return (await Promise.all(aidesScores.map(this.toViewAideCompatible.bind(this)))).filter(isViewAideEvaluee);
  }
}
