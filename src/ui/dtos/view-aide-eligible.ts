import { AideEligible } from '@/domain/models/aide-eligible';
import { ClassProperties } from '@/libs/utils/types';
import { Aide } from '@/domain/models/aide';

export type ViewAideEligible = Pick<AideEligible, 'eligibilite'> & { aide: ClassProperties<Aide> };
