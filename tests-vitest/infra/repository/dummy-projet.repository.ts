import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { Projet } from '@/domain/models/projet';

export class DummyProjetRepository implements ProjetRepositoryInterface {
  constructor(public projets: Projet[] = []) {}

  public all() {
    return Promise.resolve(this.projets);
  }

  public async fromUuid(uuid: string): Promise<Projet> {
    const projets = await this.all();
    const projet = projets.find((projet) => projet.uuid === uuid);
    if (!projet) {
      throw new Error(`Aucuns projets ne portent l'identifiant ${uuid}.`);
    }

    return projet;
  }

  add(projet: Projet): Promise<void> {
    this.projets = this.projets.concat([projet]);

    return Promise.resolve();
  }
}

// @ts-ignore
export const dummyProjetRepository = new DummyProjetRepository();
