import { Projet } from '../models/projet';

export interface ProjetRepositoryInterface {
  add(projet: Projet): Promise<void>;
  all(): Promise<Projet[]>;
  fromUuid(uuid: string): Promise<Projet>;
}
