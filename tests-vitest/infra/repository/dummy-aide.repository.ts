import short, { SUUID, UUID } from 'short-uuid';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import aides from './aides.json';

const translator = short();

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

  public async fromSuuid(suuid: SUUID): Promise<Aide> {
    return await this.fromUuid(translator.toUUID(suuid));
  }

  async fromId(atId: Aide['atId']): Promise<Aide> {
    const aides = await this.all();
    const aide = aides.find((aide) => aide.atId === atId);
    if (!aide) {
      throw new Error(`Aucunes aides ne portent l'identifiant ${atId}.`);
    }

    return aide;
  }

  async fromUuid(uuid: UUID): Promise<Aide> {
    const aides = await this.all();
    const aide = aides.find((aide) => aide.uuid === uuid);
    if (!aide) {
      throw new Error(`Aucunes aides ne portent l'identifiant ${uuid}.`);
    }

    return aide;
  }
}

// @ts-ignore
export const dummyAideRepository = new DummyAideRepository(aides);
