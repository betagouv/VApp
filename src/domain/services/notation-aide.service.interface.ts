import { ProjetEntity } from '../entities/projet.entity';
import { AideEntity } from '../entities/aide.entity';

export interface NotationAideServiceInterface {
  noterAide(aide: AideEntity, projet: ProjetEntity): Promise<number>;
}
