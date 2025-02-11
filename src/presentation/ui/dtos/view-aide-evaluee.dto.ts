import { AideScore } from '@/domain/models/aide-score';
import { AideId, AideInterface } from '@/domain/models/aide.interface';

export type ViewAideEvalueeDto = Pick<AideScore, 'scoreCompatibilite' | 'fournisseurDonnees'> & { aide: AideInterface };

export type ViewPartialAideEvalueDto = Pick<AideScore, 'scoreCompatibilite'> & { aide: { id: AideId } };

export function isViewAideEvaluee(
  vieAideEvalueeDto: ViewAideEvalueeDto | ViewPartialAideEvalueDto
): vieAideEvalueeDto is ViewAideEvalueeDto {
  return Object.hasOwn(vieAideEvalueeDto, 'fournisseurDonnees');
}
