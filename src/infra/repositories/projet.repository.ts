import type { Kysely, Selectable } from 'kysely';
import { SUUID } from 'short-uuid';
import { DB, ProjetTable } from '../database/types';
import { Projet } from '@/domain/models/projet';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { db } from '../database';
import { describe } from 'vitest';

export class ProjetRepository implements ProjetRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async add(projet: Projet) {
    await this.db
      .insertInto('projet_table')
      .values({
        uuid: projet.uuid,
        description: projet.description,
        recommendations: JSON.stringify(projet.aidesEligibles)
      })
      .execute();

    return Promise.resolve();
  }

  async update(projet: Projet) {
    await db
      .updateTable('projet_table')
      .set({
        description: projet.description
      })
      .where('uuid', '=', projet.uuid)
      .executeTakeFirst();

    return Promise.resolve();
  }

  async all() {
    const selectableProjets = await this.db
      .selectFrom('projet_table as p')
      .select(['p.uuid', 'p.description', 'p.recommendations'])
      .execute();

    return selectableProjets.map(ProjetRepository.toProjet);
  }

  async fromUuid(uuid: string): Promise<Projet> {
    const selectableProjets = await this.db
      .selectFrom('projet_table as p')
      .select(['p.uuid', 'p.description', 'p.recommendations'])
      .where('p.uuid', '=', uuid)
      .execute();

    if (selectableProjets.length === 0) {
      throw new Error(`Aucun projet trouvé pour l'identifiant ${uuid}`);
    }

    return ProjetRepository.toProjet(selectableProjets[0]);
  }

  static toProjet(selectableProjet: Pick<Selectable<ProjetTable>, 'uuid' | 'description' | 'recommendations'>): Projet {
    return new Projet(
      selectableProjet.uuid as SUUID,
      selectableProjet.description,
      // @ts-ignore
      selectableProjet.recommendations
    );
  }
}

export const projetRepository = new ProjetRepository(db);
