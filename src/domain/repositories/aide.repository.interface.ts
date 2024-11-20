import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { Aide } from '../models/aide';

export interface AideRepositoryInterface {
  all(): Promise<Aide[]>;
  findAllFor(criteresRechercheAide: CriteresRechercheAide): Promise<Aide[]>;
  fromUuid(uuid: string): Promise<Aide>;
  size(): Promise<number>;
}
