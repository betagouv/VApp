import { ExpressionBuilder, Kysely, Selectable } from 'kysely';
import short, { SUUID, UUID } from 'short-uuid';
import { AtAid, AtAideTypeFull } from '@/infra/at/aid';
import { AtApiClientInterface } from '@/infra/at/at-api-client.interface';
import { atApiClient } from '@/infra/at/api-client';
import { Aide } from '@/domain/models/aide';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { Projet } from '@/domain/models/projet';
import { unique } from '@/presentation/ui/utils/array';
import { EtatAvancementMapper } from '@/infra/mappers/etat-avancement.mapper';
import { AideTable, DB } from '../database/types';
import { db } from '../database';

const translator = short();

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

  async addFromAideTerritoires(aide: AtAid) {
    await this.db
      .insertInto('aide_table')
      .values({
        ...aide,
        targeted_audiences: aide.targeted_audiences,
        financers: aide.financers,
        financers_full: JSON.stringify(aide.aid_types_full),
        destinations: aide.destinations,
        mobilization_steps: aide.mobilization_steps,
        aid_types: aide.aid_types,
        aid_types_full: JSON.stringify(aide.aid_types_full)
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
        'a.programs'
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
    etatAvancement
  }: Pick<Projet, 'porteur' | 'zonesGeographiques' | 'etatAvancement'>) {
    let atAidesIds: number[] = [];
    for (const zoneGeographique of zonesGeographiques) {
      const atApiAidesForProjet = await this.atApiClient.searchAides({
        organization_type_slugs: porteur ? [porteur] : [],
        perimeter_id: zoneGeographique.id,
        aid_step_slugs: etatAvancement ? [EtatAvancementMapper.fromLesCommunsToAt(etatAvancement)] : []
      });

      atAidesIds = atAidesIds.concat(atApiAidesForProjet.map(({ id }) => id));
    }
    return atAidesIds.filter(unique);
  }

  async findAllForProjet({ porteur, zonesGeographiques, etatAvancement }: Projet, { payante }: CriteresRechercheAide) {
    const atAidesIds: number[] = await this.findAtAidesIdsForProjet({ porteur, zonesGeographiques, etatAvancement });

    const selectables = await this.select()
      .where('a.id', 'in', atAidesIds)
      .where(this.numberOfTokenIsValid)
      .$if(payante !== undefined, (qb) => qb.where('a.is_charged', '=', payante === true))
      .execute();

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

  async fromUuid(uuid: string): Promise<Aide> {
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
        'a.programs'
      ])
      .where('a.uuid', '=', uuid)
      .execute();

    if (selectableAides.length === 0) {
      throw new Error(`Aucune aide trouvée pour l'identifiant ${uuid}`);
    }

    return AtAideRepository.toAide(selectableAides[0]);
  }

  async fromSuuid(suuid: SUUID): Promise<Aide> {
    return this.fromUuid(translator.toUUID(suuid));
  }

  async fromId(id: AtAid['id']): Promise<Aide> {
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
        'a.programs'
      ])
      .where('a.id', '=', id)
      .execute();

    if (selectableAides.length === 0) {
      throw new Error(`Aucune aide trouvée pour l'identifiant AT ${id}`);
    }

    return AtAideRepository.toAide(selectableAides[0]);
  }

  static toAide(
    selectableAide: Pick<
      Selectable<AideTable>,
      'uuid' | 'id' | 'name' | 'description_md' | 'url' | 'aid_types_full' | 'programs'
    >
  ): Aide {
    return new Aide(
      selectableAide.uuid as UUID,
      selectableAide.id,
      selectableAide.name,
      selectableAide.description_md || '',
      selectableAide.url,
      selectableAide.aid_types_full as AtAideTypeFull[],
      selectableAide.programs
    );
  }
}

export const aideRepository = new AtAideRepository(db, atApiClient);
