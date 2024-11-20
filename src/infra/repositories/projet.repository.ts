import type { Insertable, Kysely, Selectable, Updateable } from 'kysely';
import { SUUID } from 'short-uuid';
import { DB, ProjetTable } from '../database/types';
import { Projet } from '@/domain/models/projet';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { db } from '../database';

export class ProjetRepository implements ProjetRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async add(projet: Projet) {
    await this.db.insertInto('projet_table').values(ProjetRepository.toInsertable(projet)).execute();

    return Promise.resolve();
  }

  async save(projet: Projet) {
    await db
      .updateTable('projet_table')
      .set(ProjetRepository.toUpdateable(projet))
      .where('uuid', '=', projet.uuid)
      .executeTakeFirst();

    return Promise.resolve();
  }

  /**
   * @deprecated use save instead
   */
  async update(projet: Projet) {
    return this.save(projet);
  }

  async all() {
    const selectableProjets = await this.db
      .selectFrom('projet_table as p')
      .select(['p.uuid', 'p.description', 'p.recommendations', 'p.criteres_recherche_aide'])
      .execute();

    return selectableProjets.map(ProjetRepository.toProjet);
  }

  async fromUuid(uuid: string): Promise<Projet> {
    const selectableProjets = await this.db
      .selectFrom('projet_table as p')
      .select(['p.uuid', 'p.description', 'p.recommendations', 'p.criteres_recherche_aide'])
      .where('p.uuid', '=', uuid)
      .execute();

    if (selectableProjets.length === 0) {
      throw new Error(`Aucun projet trouvé pour l'identifiant ${uuid}`);
    }

    return ProjetRepository.toProjet(selectableProjets[0]);
  }

  static toUpdateable(projet: Projet): Updateable<ProjetTable> {
    return {
      description: projet.description || '',
      recommendations: JSON.stringify(projet.aidesEligibles),
      criteres_recherche_aide: JSON.stringify(projet.criteresRechercheAide)
    };
  }

  static toInsertable(projet: Projet): Insertable<ProjetTable> {
    return {
      uuid: projet.uuid,
      ...ProjetRepository.toUpdateable(projet),
      description: projet.description || ''
    };
  }

  static toProjet(
    selectableProjet: Pick<
      Selectable<ProjetTable>,
      'uuid' | 'description' | 'recommendations' | 'criteres_recherche_aide'
    >
  ): Projet {
    return new Projet(
      selectableProjet.uuid as SUUID,
      selectableProjet.description,
      // @ts-expect-error this field should be a relationship table
      selectableProjet.recommendations || [],
      selectableProjet.criteres_recherche_aide
    );
  }
}

export const projetRepository = new ProjetRepository(db);
