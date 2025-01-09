import { ClassProperties } from '@/presentation/types';
import { AideScore } from '@/domain/models/aide-score';
import { Aide } from '@/domain/models/aide';

export type ViewAideCompatibleDto = Pick<AideScore, 'scoreCompatibilite'> & { aide: ClassProperties<Aide> };
