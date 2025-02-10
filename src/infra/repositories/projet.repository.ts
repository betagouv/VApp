import { Insertable, Kysely, Selectable, sql, Updateable } from 'kysely';
import { SUUID, UUID } from 'short-uuid';
import { db } from '../database';
import { DB, JsonValue, ProjetTable } from '../database/types';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { Projet } from '@/domain/models/projet';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { AideScoreMap } from '@/domain/models/aide-score.map';
import { ZoneGeographiqueRepositoryInterface } from '@/domain/repositories/zone-geographique-repository.interface';
import { atZoneGeographiqueRepository } from '@/infra/repositories/at-zone-geographique.repository';

type ProjetRow = Pick<
  Selectable<ProjetTable>,
  'suuid' | 'uuid' | 'description' | 'recommendations' | 'etat_avancement' | 'porteur' | 'client_id'
> & { territoire_ids: string[] };

export class ProjetRepository implements ProjetRepositoryInterface {
  constructor(
    public db: Kysely<DB>,
    private readonly territoireRepository: ZoneGeographiqueRepositoryInterface
  ) {}

  private selectProjet() {
    return this.db
      .selectFrom('projet_table as p')
      .leftJoin('projet_zone_geographique_table as pzg', 'pzg.projet_uuid', 'p.uuid')
      .select([
        'p.uuid',
        'p.suuid',
        'p.description',
        'p.recommendations',
        'p.porteur',
        'p.etat_avancement',
        'p.client_id'
      ])
      .select(sql<string[]>`array_remove(array_agg(pzg.at_perimeter_id), null)`.as('territoire_ids'))
      .groupBy([
        'p.uuid',
        'p.suuid',
        'p.description',
        'p.recommendations',
        'p.porteur',
        'p.etat_avancement',
        'p.client_id'
      ]);
  }

  async add(projet: Projet): Promise<void> {
    await this.db.insertInto('projet_table').values(ProjetRepository.toInsertable(projet)).execute();

    await this.updateZonesGeographiques(projet);
  }

  async save(projet: Projet): Promise<void> {
    await this.db
      .updateTable('projet_table')
      .set(ProjetRepository.toUpdateable(projet))
      .where('uuid', '=', projet.uuid)
      .executeTakeFirstOrThrow();

    await this.updateZonesGeographiques(projet);
  }

  /**
   * @deprecated Utilisez save() à la place.
   */
  async update(projet: Projet): Promise<void> {
    return this.save(projet);
  }

  async all(): Promise<Projet[]> {
    const rows = await this.selectProjet().execute();
    return await Promise.all(rows.map(this.toProjet));
  }

  async fromSuuid(suuid: SUUID): Promise<Projet> {
    const rows = await this.selectProjet().where('p.suuid', '=', suuid).execute();
    if (rows.length === 0) {
      throw new Error(`Aucun projet trouvé pour l'identifiant ${suuid}`);
    }
    return await this.toProjet(rows[0]);
  }

  async fromUuid(uuid: UUID): Promise<Projet> {
    const projet = await this.findOneById(uuid);
    if (!projet) {
      throw new Error(`Aucun projet trouvé pour l'identifiant ${uuid}`);
    }
    return projet;
  }

  async findOneById(id: string): Promise<Projet | null> {
    const rows = await this.selectProjet().where('p.uuid', '=', id).execute();
    if (rows.length === 0) {
      return null;
    }
    return await this.toProjet(rows[0]);
  }

  async findForCommune(codeInsee: string, description: string): Promise<Projet | null> {
    const rows = await this.selectProjet()
      .leftJoin('at_perimeter_table as atp', 'atp.id', 'pzg.at_perimeter_id')
      .where('atp.code', '=', codeInsee)
      .where('p.description', '=', description)
      .groupBy('p.uuid')
      .execute();

    if (rows.length === 0) {
      return null;
    }
    return await this.toProjet(rows[0]);
  }

  async updateZonesGeographiques(projet: Projet): Promise<void> {
    // Supprime les associations existantes
    await this.db.deleteFrom('projet_zone_geographique_table').where('projet_uuid', '=', projet.uuid).execute();

    // Insère les nouvelles associations si des zones sont définies
    if (projet.zonesGeographiques.length > 0) {
      const values = projet.zonesGeographiques.map(({ id }) => ({
        projet_uuid: projet.uuid,
        at_perimeter_id: id
      }));

      await this.db.insertInto('projet_zone_geographique_table').values(values).execute();
    }
  }

  static toUpdateable(projet: Projet): Updateable<ProjetTable> {
    return {
      description: projet.description,
      recommendations: JSON.stringify(projet.getSortedAideScores()),
      porteur: projet.porteur,
      etat_avancement: projet.etatAvancement,
      client_id: projet.clientId,
      criteres_recherche_aide: JSON.stringify({
        beneficiaire: projet.porteur,
        etatsAvancements: [projet.etatAvancement]
      })
    };
  }

  static toInsertable(projet: Projet): Insertable<ProjetTable> {
    return {
      uuid: projet.uuid,
      suuid: projet.suuid,
      porteur: projet.porteur,
      ...ProjetRepository.toUpdateable(projet),
      description: projet.description
    };
  }

  toAideScoreMap(recommendations: JsonValue) {
    const aideScoreMap: AideScoreMap = new Map();
    if (Array.isArray(recommendations)) {
      recommendations.forEach((recommendation: JsonValue) => {
        // @ts-expect-error I know...
        const aideId = recommendation?.aideId;
        // @ts-expect-error I know...
        const scoreCompatibilite = recommendation?.eligibilite || recommendation?.scoreCompatibilite;
        if (aideId && scoreCompatibilite !== undefined) {
          aideScoreMap.set(aideId, {
            aideId: aideId as UUID,
            scoreCompatibilite: scoreCompatibilite as number
          });
        }
      });
    }
    return aideScoreMap;
  }

  async toProjet(row: ProjetRow): Promise<Projet> {
    return new Projet(
      row.uuid as UUID,
      row.description,
      row.porteur as AtOrganizationTypeSlug,
      row.etat_avancement as LesCommunsProjetStatuts,
      await Promise.all(row.territoire_ids.map(atZoneGeographiqueRepository.fromId.bind(atZoneGeographiqueRepository))),
      this.toAideScoreMap(row.recommendations),
      row.client_id ? (row.client_id as UUID) : undefined
    );
  }
}

export const projetRepository = new ProjetRepository(db, atZoneGeographiqueRepository);
