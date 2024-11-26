import { Beneficiaire } from '@/domain/models/beneficiaire';
import { Territoire } from '@/domain/models/territoire';
import { Payante } from '@/domain/models/payante';

export type CriteresRechercheAide = {
  beneficiaire?: Beneficiaire;
  territoireId?: Territoire['aidesTerritoiresId'];
  payante?: Payante;
  etatsAvancements?: string[];
  aideNatures?: string[];
  actionsConcernees?: string[];
};
