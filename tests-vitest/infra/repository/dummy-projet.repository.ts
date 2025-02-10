import short, { SUUID, UUID } from 'short-uuid';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { Projet } from '@/domain/models/projet';

const translator = short();

export class DummyProjetRepository implements ProjetRepositoryInterface {
  constructor(public projets: Projet[] = []) {}

  public all() {
    return Promise.resolve(this.projets);
  }

  public async fromUuid(uuid: string): Promise<Projet> {
    return await this.fromUuid(translator.toUUID(uuid));
  }

  async findOneById(id: UUID): Promise<Projet | null> {
    return await this.fromUuid(translator.toUUID(id));
  }

  add(projet: Projet): Promise<void> {
    this.projets = this.projets.concat([projet]);

    return Promise.resolve();
  }

  save(): Promise<void> {
    return Promise.resolve();
  }

  async fromSuuid(suuid: SUUID): Promise<Projet> {
    const projets = await this.all();
    const projet = projets.find((projet) => projet.suuid === suuid);
    if (!projet) {
      throw new Error(`Aucuns projets ne portent l'identifiant ${suuid}.`);
    }

    return projet;
  }
}

export const dummyProjetRepository = new DummyProjetRepository();
