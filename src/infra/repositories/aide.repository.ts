import type { ExpressionBuilder, Kysely, Selectable } from 'kysely';
import { AtAid, AtAideTypeFull } from '@/infra/at/aid';
import { AtApiClientInterface } from '@/infra/at/at-api-client.interface';
import { atApiClient } from '@/infra/at/api-client';
import { AideTable, DB } from '../database/types';
import { db } from '../database';
import { Aide } from '@/domain/models/aide';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

export const envNumber = (envString?: string | number, defaultValue = 0): number =>
  envString ? Number(envString) : defaultValue;

export const getNbTokenRange = (): [number, number] => [
  envNumber(process.env.AIDE_DESCRIPTION_MIN_TOKEN, 200),
  envNumber(process.env.AIDE_DESCRIPTION_MAX_TOKEN, 5000)
];

export class AideRepository implements AideRepositoryInterface {
  constructor(
    public db: Kysely<DB>,
    public atApiClient: AtApiClientInterface
  ) {}

  // static getSelectableFields(): SelectExpression<{ a: AideTable }, 'a'> {
  //   return ['a.uuid', 'a.nom', 'a.description', 'a.url', 'a.aides_territoire_id', 'a.targeted_audiences'];
  // }

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

    return selectableProjets.map(AideRepository.toAide);
  }

  async findAllFor({
    beneficiaire,
    territoireId,
    payante,
    aideNatures,
    etatsAvancements,
    actionsConcernees
  }: CriteresRechercheAide) {
    const atAides = await this.atApiClient.searchAides({
      is_charged: payante,
      organization_type_slugs: beneficiaire ? [beneficiaire] : [],
      perimeter_id: territoireId,
      aid_step_slugs: etatsAvancements,
      aid_destination_slugs: actionsConcernees,
      aid_type_group_slug: aideNatures
    });

    const selectables = await this.select()
      .where(
        'a.id',
        'in',
        atAides.map((aide) => aide.id)
      )
      .execute();

    console.log(`${selectables.length}/${atAides.length} left after filtering on token number.`);

    return selectables.map(AideRepository.toAide);
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

    return AideRepository.toAide(selectableAides[0]);
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

    return AideRepository.toAide(selectableAides[0]);
  }

  static toAide(
    selectableAide: Pick<
      Selectable<AideTable>,
      'uuid' | 'id' | 'name' | 'description_md' | 'url' | 'aid_types_full' | 'programs'
    >
  ): Aide {
    return new Aide(
      selectableAide.uuid,
      selectableAide.id,
      selectableAide.name,
      selectableAide.description_md || '',
      selectableAide.url,
      selectableAide.aid_types_full as AtAideTypeFull[],
      selectableAide.programs
    );
  }
}

export const aideRepository = new AideRepository(db, atApiClient);
