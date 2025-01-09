import { Payante } from '@/domain/models/payante';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtAidDestination } from '@/infra/at/aid-destination';

export type CriteresRechercheAide = {
  payante?: Payante;
  natures?: AtAidTypeGroup[];
  actionsConcernees?: AtAidDestination[];
};
