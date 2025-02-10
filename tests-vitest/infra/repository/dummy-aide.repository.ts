import short from 'short-uuid';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import aides from './aides.json';
import { AideId } from '@/domain/models/aide.interface';

export class DummyAideRepository implements AideRepositoryInterface {
  constructor(public aides: Aide[] = []) {}

  public all() {
    return Promise.resolve(this.aides);
  }

  public size() {
    return Promise.resolve(this.aides.length);
  }

  findAllForProjet(projet: Projet, criteresRechercheAide: CriteresRechercheAide): Promise<Aide[]> {
    return Promise.resolve(this.aides);
  }

  async fromId(aideId: AideId): Promise<Aide> {
    const aides = await this.all();
    const aide = aides.find((aide) => aide.id === aideId);
    if (!aide) {
      throw new Error(`Aucunes aides ne portent l'identifiant ${aideId}.`);
    }

    return aide;
  }
}

// @ts-ignore
export const dummyAideRepository = new DummyAideRepository(aides);
