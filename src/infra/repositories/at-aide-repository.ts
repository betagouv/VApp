import { ExpressionBuilder, Kysely, Selectable } from 'kysely';
import { AtAid, AtAideTypeFull } from '@/infra/at/aid';
import { AtApiClientInterface } from '@/infra/at/at-api-client.interface';
import { atApiClient } from '@/infra/at/api-client';
import { AtSearchAidsQuery } from '@/infra/at/search-aids-query';
import { EtatAvancementMapper } from '@/infra/mappers/etat-avancement.mapper';
import { db } from '@/infra/database';
import { AideTable, DB } from '@/infra/database/types';

import { Aide } from '@/domain/models/aide';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { Projet } from '@/domain/models/projet';
import { AideId } from '@/domain/models/aide.interface';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';

import { unique } from '@/presentation/ui/utils/array';

export const envNumber = (envString?: string | number, defaultValue = 0): number =>
  envString ? Number(envString) : defaultValue;

export const getNbTokenRange = (): [number, number] => [
  envNumber(process.env.AIDE_DESCRIPTION_MIN_TOKEN, 200),
  envNumber(process.env.AIDE_DESCRIPTION_MAX_TOKEN, 5000)
];

export class AtAideRepository implements AideRepositoryInterface {
  constructor(
    public db: Kysely<DB>,
    public atApiClient: AtApiClientInterface
  ) {}

  async addFromAideTerritoires(atAid: AtAid) {
    await this.db
      .insertInto('aide_table')
      .values({
        ...atAid,
        id: atAid.id.toString(),
        targeted_audiences: atAid.targeted_audiences,
        financers: atAid.financers,
        financers_full: JSON.stringify(atAid.aid_types_full),
        destinations: atAid.destinations,
        mobilization_steps: atAid.mobilization_steps,
        aid_types: atAid.aid_types,
        aid_types_full: JSON.stringify(atAid.aid_types_full),
        data_provider: FournisseurDonneesAides.AideTerritoires
      })
      .execute();

    return Promise.resolve();
  }

  private select() {
    return this.db
      .selectFrom('aide_table as a')
      .select([
        'a.uuid',
        'a.id',
        'a.name',
        'a.description_md',
        'a.url',
        'a.targeted_audiences',
        'a.aid_types_full',
        'a.programs',
        'a.data_provider'
      ])
      .where(this.numberOfTokenIsValid);
  }

  private numberOfTokenIsValid({ eb, and }: ExpressionBuilder<DB & { a: AideTable }, 'a'>) {
    const tokenRange = getNbTokenRange();
    return and([
      eb('a.token_numb_description', '>', tokenRange[0]),
      eb('a.token_numb_description', '<', tokenRange[1])
    ]);
  }

  async all() {
    const selectableProjets = await this.select().execute();

    return selectableProjets.map(AtAideRepository.toAide);
  }

  async findAtAidesIdsForProjet({
    porteur,
    zonesGeographiques,
    etatAvancement,
    criteresRechercheAide
  }: Pick<Projet, 'porteur' | 'zonesGeographiques' | 'etatAvancement' | 'criteresRechercheAide'>) {
    let atAidesIds: number[] = [];
    const atCriteria: AtSearchAidsQuery = {
      organization_type_slugs: porteur ? [porteur] : [],
      aid_step_slugs: etatAvancement ? [EtatAvancementMapper.fromLesCommunsToAt(etatAvancement)] : [],
      aid_destination_slugs: criteresRechercheAide?.actionsConcernees,
      aid_type_group_slug: criteresRechercheAide?.natures
    };
    if (zonesGeographiques?.length > 0) {
      for (const zoneGeographique of zonesGeographiques) {
        const atApiAidesForProjet = await this.atApiClient.searchAides({
          ...atCriteria,
          perimeter_id: zoneGeographique.id
        });

        atAidesIds = atAidesIds.concat(atApiAidesForProjet.map(({ id }) => id));
      }
    } else {
      const atApiAidesForProjet = await this.atApiClient.searchAides({
        ...atCriteria
      });
      atAidesIds = atAidesIds.concat(atApiAidesForProjet.map(({ id }) => id));
    }

    return atAidesIds.filter(unique);
  }

  async findAllForProjet(projet: Projet, { payante }: CriteresRechercheAide) {
    const atAidesIds: number[] = await this.findAtAidesIdsForProjet(projet);
    console.log(atAidesIds);
    const selectables = await this.select()
      .where(
        'a.id',
        'in',
        atAidesIds.map((id) => id.toString())
      )
      .where(this.numberOfTokenIsValid)
      .$if(payante !== undefined, (qb) => qb.where('a.is_charged', '=', payante === true))
      .execute();
    if (atAidesIds.length !== selectables.length) {
      console.error(
        `${atAidesIds.length} were found in AT database but only ${selectables.length} were selected in VApp. Token range ${getNbTokenRange().join('-')} Payante: ${(payante === true).toString()}`
      );
    }

    const aides = selectables.map(AtAideRepository.toAide);
    if (process.env.NB_AIDE_HARD_LIMIT) {
      console.log(`NB_AIDE_HARD_LIMIT a été fixé à ${process.env.NB_AIDE_HARD_LIMIT}.`);
      console.log(`La recherche ne sera lancée que sur ${process.env.NB_AIDE_HARD_LIMIT} aides max.`);
      const sliceArgs: [number, number] = [0, Number(process.env.NB_AIDE_HARD_LIMIT)];

      return aides.slice(...sliceArgs);
    }

    return aides;
  }

  async size() {
    const { size } = await this.db
      .selectFrom('aide_table as a')
      .select(db.fn.countAll().as('size'))
      .where(this.numberOfTokenIsValid)
      .executeTakeFirstOrThrow();

    return size as number;
  }

  async fromId(id: AideId): Promise<Aide> {
    const aide = await this.findOneById(id);

    if (!aide) {
      throw new Error(`Aucune aide trouvée pour l'identifiant AT ${id}`);
    }

    return aide;
  }

  async findOneById(id: AideId): Promise<Aide | null> {
    const selectableAides = await this.db
      .selectFrom('aide_table as a')
      .select([
        'a.uuid',
        'a.id',
        'a.name',
        'a.description_md',
        'a.url',
        'a.targeted_audiences',
        'a.aid_types_full',
        'a.programs',
        'a.data_provider'
      ])
      .where('a.id', '=', id)
      .where('a.data_provider', '=', FournisseurDonneesAides.AideTerritoires)
      .execute();

    if (selectableAides.length === 0) {
      return null;
    }

    return AtAideRepository.toAide(selectableAides[0]);
  }

  static toAide(
    selectableAide: Pick<
      Selectable<AideTable>,
      'id' | 'name' | 'description_md' | 'url' | 'aid_types_full' | 'programs' | 'data_provider'
    >
  ): Aide {
    return new Aide(
      selectableAide.id,
      selectableAide.name,
      selectableAide.description_md || '',
      selectableAide.aid_types_full as AtAideTypeFull[],
      selectableAide.programs,
      selectableAide.url,
      selectableAide.data_provider as FournisseurDonneesAides
    );
  }
}

export const aideRepository = new AtAideRepository(db, atApiClient);
