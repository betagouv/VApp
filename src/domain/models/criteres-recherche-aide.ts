import { Beneficiaire } from '@/domain/models/beneficiaire';
import { Territoire } from '@/domain/models/territoire';
import { Payante } from '@/domain/models/payante';
import { AtAidTypeGroupType } from '@/infra/at/aid-type-group';

export type CriteresRechercheAide = {
  beneficiaire?: Beneficiaire;
  territoireId?: Territoire['aidesTerritoiresId'];
  payante?: Payante;
  etatsAvancements?: string[];
  aideNatures?: AtAidTypeGroupType[];
  actionsConcernees?: string[];
};
