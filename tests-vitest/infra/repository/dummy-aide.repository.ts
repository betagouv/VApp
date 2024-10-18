import { AideRepositoryInterface } from '../../../src/domain/repositories/aide.repository.interface';
import { Aide } from '../../../src/domain/models/aide';
import aides from './aides.json';

export class DummyAideRepository implements AideRepositoryInterface {
  constructor(public aides: Aide[] = []) {}

  public all() {
    return Promise.resolve(this.aides);
  }

  public async fromUuid(uuid: string): Promise<Aide> {
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
