import type { Kysely, Selectable } from 'kysely';
import { SUUID } from 'short-uuid';
import { DB, ProjetTable } from '../database/types';
import { Projet } from '@/domain/models/projet';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { db } from '../database';

export class ProjetRepository implements ProjetRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async add(projet: Projet) {
    await this.db
      .insertInto('projet_table')
      .values({
        uuid: projet.uuid,
        description: projet.description,
        recommendations: JSON.stringify(projet.aidesEligibles),
        audience: projet.audience
      })
      .execute();

    return Promise.resolve();
  }

  save(projet: Projet) {
    return this.update(projet);
  }

  /**
   * @deprecated use save instead
   */
  async update(projet: Projet) {
    await db
      .updateTable('projet_table')
      .set({
        description: projet.description,
        audience: projet.audience
      })
      .where('uuid', '=', projet.uuid)
      .executeTakeFirst();

    return Promise.resolve();
  }

  async all() {
    const selectableProjets = await this.db
      .selectFrom('projet_table as p')
      .select(['p.uuid', 'p.description', 'p.recommendations', 'p.audience'])
      .execute();

    return selectableProjets.map(ProjetRepository.toProjet);
  }

  async fromUuid(uuid: string): Promise<Projet> {
    const selectableProjets = await this.db
      .selectFrom('projet_table as p')
      .select(['p.uuid', 'p.description', 'p.recommendations', 'p.audience'])
      .where('p.uuid', '=', uuid)
      .execute();

    if (selectableProjets.length === 0) {
      throw new Error(`Aucun projet trouvé pour l'identifiant ${uuid}`);
    }

    return ProjetRepository.toProjet(selectableProjets[0]);
  }

  static toProjet(
    selectableProjet: Pick<Selectable<ProjetTable>, 'uuid' | 'description' | 'recommendations' | 'audience'>
  ): Projet {
    return new Projet(
      selectableProjet.uuid as SUUID,
      selectableProjet.description,
      // @ts-expect-error dunno
      selectableProjet.recommendations,
      selectableProjet.audience
    );
  }
}

export const projetRepository = new ProjetRepository(db);
