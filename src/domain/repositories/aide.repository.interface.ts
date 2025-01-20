import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { Aide } from '../models/aide';
import { Pagination } from '@/domain/models/pagination';

export interface AideRepositoryInterface {
  all(): Promise<Aide[]>;
  findAllFor(criteresRechercheAide: CriteresRechercheAide, pagination: Pagination): Promise<Aide[]>;
  fromUuid(uuid: string): Promise<Aide>;
  size(): Promise<number>;
}
