import { Beneficiaire } from '@/domain/models/beneficiaire';
import { Territoire } from '@/domain/models/territoire';

export type CriteresRechercheAide = {
  beneficiaire?: Beneficiaire;
  territoireId?: Territoire['aidesTerritoiresId'];
  payante?: boolean;
  etatsAvancements?: string[];
  aideNatures?: string[];
  actionsConcernees?: string[];
};
