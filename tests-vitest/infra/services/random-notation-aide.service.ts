import { NotationAideServiceInterface } from '../../../src/domain/services/notation-aide.service.interface';
import { NOTE_MAX, NOTE_MIN } from '../../../src/domain/note';
import { Aide } from '../../../src/domain/models/aide';
import { Projet } from '../../../src/domain/models/projet';

export class RandomNotationAideService implements NotationAideServiceInterface {
  public noterAide(aide: Aide, projet: Projet) {
    return Promise.resolve(Math.floor(Math.random() * NOTE_MAX) + NOTE_MIN);
  }
}

export const randomNotationAideService = new RandomNotationAideService();
