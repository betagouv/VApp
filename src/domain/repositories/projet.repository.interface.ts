import { Projet } from '@/domain/models/projet';
import { SUUID, UUID } from 'short-uuid';

export interface ProjetRepositoryInterface {
  add(projet: Projet): Promise<void>;
  save(projet: Projet): Promise<void>;
  all(): Promise<Projet[]>;
  fromUuid(uuid: UUID): Promise<Projet>;
  fromSuuid(uuid: SUUID): Promise<Projet>;
}
