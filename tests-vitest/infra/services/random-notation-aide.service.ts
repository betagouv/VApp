import { NotationAideServiceInterface } from '../../../src/domain/services/notation-aide.service.interface';
import { NOTE_MAX, NOTE_MIN } from '../../../src/domain/note';
import { AideEntity } from '../../../src/domain/entities/aide.entity';
import { ProjetEntity } from '../../../src/domain/entities/projet.entity';

export class RandomNotationAideService implements NotationAideServiceInterface {
  public noterAide(aide: AideEntity, projet: ProjetEntity) {
    return Promise.resolve(Math.floor(Math.random() * NOTE_MAX) + NOTE_MIN);
  }
}

export const randomNotationAideService = new RandomNotationAideService();
