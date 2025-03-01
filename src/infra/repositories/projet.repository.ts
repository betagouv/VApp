import { Insertable, Kysely, Selectable, sql, Updateable } from 'kysely';
import { SUUID, UUID } from 'short-uuid';

import { db } from '@/infra/database';
import { DB, JsonObject, JsonValue, ProjetTable } from '@/infra/database/types';
import { atZoneGeographiqueRepository } from '@/infra/repositories/at-zone-geographique.repository';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtAidDestination } from '@/infra/at/aid-destination';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';

import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { ZoneGeographiqueRepositoryInterface } from '@/domain/repositories/zone-geographique-repository.interface';
import { Projet } from '@/domain/models/projet';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { AideScoreMap } from '@/domain/models/aide-score.map';
import { Payante } from '@/domain/models/payante';
import { AideScore } from '@/domain/models/aide-score';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { unique } from '@/presentation/ui/utils/array';

function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type ProjetRow = Pick<
  Selectable<ProjetTable>,
  | 'suuid'
  | 'uuid'
  | 'description'
  | 'aides_scores'
  | 'etat_avancement'
  | 'porteur'
  | 'client_id'
  | 'criteres_recherche_aide'
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
        'p.aides_scores',
        'p.porteur',
        'p.etat_avancement',
        'p.client_id',
        'p.criteres_recherche_aide'
      ])
      .select(sql<string[]>`array_remove(array_agg(pzg.at_perimeter_id), null)`.as('territoire_ids'))
      .groupBy([
        'p.uuid',
        'p.suuid',
        'p.description',
        'p.aides_scores',
        'p.porteur',
        'p.etat_avancement',
        'p.client_id',
        'p.criteres_recherche_aide'
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
      aides_scores: JSON.stringify(projet.getSortedAideScores()),
      porteur: projet.porteur,
      etat_avancement: projet.etatAvancement,
      client_id: projet.clientId,
      criteres_recherche_aide: JSON.stringify({
        beneficiaire: projet.porteur,
        etatsAvancements: [projet.etatAvancement],
        ...projet.criteresRechercheAide
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

  toAideScoreMap(jsonAidesScores: JsonValue) {
    const aideScoreMap: AideScoreMap = new Map();
    if (Array.isArray(jsonAidesScores)) {
      jsonAidesScores.forEach((jsonAideScore: JsonValue) => {
        if (isJsonObject(jsonAideScore)) {
          const { aideId, scoreCompatibilite, fournisseurDonnees } = jsonAideScore;
          if (aideId && scoreCompatibilite != null) {
            aideScoreMap.set(
              aideId as string,
              new AideScore(
                scoreCompatibilite as number,
                aideId as string,
                fournisseurDonnees ? (fournisseurDonnees as FournisseurDonneesAides) : undefined
              )
            );
          }
        }
      });
    }
    return aideScoreMap;
  }

  toCriteresRechercheAide(jsonCriteresRechercheAide: JsonValue) {
    const criteresRechercheAide: CriteresRechercheAide = {};
    if (isJsonObject(jsonCriteresRechercheAide)) {
      if (jsonCriteresRechercheAide?.payante) {
        criteresRechercheAide.payante = jsonCriteresRechercheAide?.payante as Payante;
      }
      if (jsonCriteresRechercheAide?.natures) {
        criteresRechercheAide.natures = jsonCriteresRechercheAide?.natures as AtAidTypeGroup[];
      }
      if (jsonCriteresRechercheAide?.actionsConcernees) {
        criteresRechercheAide.actionsConcernees = jsonCriteresRechercheAide?.actionsConcernees as AtAidDestination[];
      }
    }

    return criteresRechercheAide;
  }

  async toProjet(row: ProjetRow): Promise<Projet> {
    const projet = new Projet(
      row.uuid as UUID,
      row.description,
      row.porteur as AtOrganizationTypeSlug,
      row.etat_avancement as LesCommunsProjetStatuts,
      await Promise.all(
        row.territoire_ids.filter(unique).map(atZoneGeographiqueRepository.fromId.bind(atZoneGeographiqueRepository))
      ),
      this.toAideScoreMap(row.aides_scores),
      row.client_id ? (row.client_id as UUID) : undefined
    );
    projet.criteresRechercheAide = this.toCriteresRechercheAide(row.criteres_recherche_aide);

    return projet;
  }
}

export const projetRepository = new ProjetRepository(db, atZoneGeographiqueRepository);
