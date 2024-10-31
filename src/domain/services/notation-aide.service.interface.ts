import { Projet } from '../models/projet';
import { Aide } from '../models/aide';

export interface NotationAideServiceInterface {
  noterAide(aide: Aide, projet: Projet): Promise<number | void>;
  initialize(): Promise<void>;
}
