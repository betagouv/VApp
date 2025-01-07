import { Beneficiaire } from '@/domain/models/beneficiaire';
import { Territoire } from '@/domain/models/territoire';
import { Payante } from '@/domain/models/payante';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtAidDestination } from '@/infra/at/aid-destination';
import { AtAidStep } from '@/infra/at/aid-step';

export type CriteresRechercheAide = {
  beneficiaire?: Beneficiaire;
  territoireId?: Territoire['aidesTerritoiresId'];
  payante?: Payante;
  etatsAvancements?: AtAidStep[];
  aideNatures?: AtAidTypeGroup[];
  actionsConcernees?: AtAidDestination[];
};
