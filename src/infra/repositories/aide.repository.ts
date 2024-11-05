import type { ExpressionBuilder, Kysely, Selectable } from 'kysely';
import { SUUID } from 'short-uuid';
import { AideAidesTerritoiresDto } from '@/infra/dtos/aide-aides-territoires.dto';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { Aide } from '@/domain/models/aide';
import { AideTable, DB } from '../database/types';
import { db } from '../database';

const pythonJsonParse = (pythonJsonString: string) =>
  JSON.parse(
    pythonJsonString
      .replaceAll(", '", ', "')
      .replaceAll("', ", '", ')
      // array start & end
      .replaceAll("['", '["')
      .replaceAll("']", '"]')
      // object
      // start & end
      .replaceAll("{'", '{"')
      .replaceAll("'}", '"}')
      // properties
      .replaceAll("': '", '": "') // first string
      .replaceAll("': ", '": ') // then number
      .replaceAll("'}", '"}')
      .replaceAll(': None', ': "None"')
      .replaceAll('\\xa0', ' ')
  );

const envNumber = (envString?: string, defaultValue = 0): number => (envString ? Number(envString) : defaultValue);

export class AideRepository implements AideRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async addFromAideTerritoires(aide: AideAidesTerritoiresDto) {
    await this.db
      .insertInto('aide_table')
      .values({
        uuid: Aide.createUuid(),
        nom: aide.name,
        description: aide.description_md,
        criteres_eligibilite: aide.eligibility_md,
        aides_territoire_id: Number(aide.id),
        url: aide.url,
        targeted_audiences: JSON.stringify(pythonJsonParse(aide.targeted_audiences)),
        token_numb_description: Number(aide.token_numb_description),
        token_numb_eligibility: Number(aide.token_numb_eligibility),
        perimeter: aide.perimeter,
        perimeter_scale: aide.perimeter_scale,
        financers: JSON.stringify(pythonJsonParse(aide.financers))
      })
      .execute();

    return Promise.resolve();
  }

  private select() {
    return this.db
      .selectFrom('aide_table as a')
      .select(['a.uuid', 'a.nom', 'a.description', 'a.url'])
      .where(this.numberOfTokenIsValid);
  }

  private numberOfTokenIsValid({ eb, and }: ExpressionBuilder<DB & { a: AideTable }, 'a'>) {
    return and([
      eb('a.token_numb_description', '>', envNumber(process.env.AIDE_DESCRIPTION_MIN_TOKEN, 200)),
      eb('a.token_numb_description', '<', envNumber(process.env.AIDE_DESCRIPTION_MAX_TOKEN, 1500))
    ]);
  }

  async all() {
    const selectableProjets = await this.select().execute();

    return selectableProjets.map(AideRepository.toAide);
  }

  async size() {
    const { size } = await this.db
      .selectFrom('aide_table as a')
      .select(db.fn.countAll().as('size'))
      .where(this.numberOfTokenIsValid)
      .executeTakeFirstOrThrow();

    return size as number;
  }

  async findAllForAudience(audience: string) {
    const selectableProjets = await this.select()
      .where('a.targeted_audiences', '@>', JSON.stringify([audience]))
      .execute();

    return selectableProjets.map(AideRepository.toAide);
  }

  async fromUuid(uuid: string): Promise<Aide> {
    const selectableAides = await this.db
      .selectFrom('aide_table as a')
      .select(['a.uuid', 'a.nom', 'a.description', 'a.url'])
      .where('a.uuid', '=', uuid)
      .execute();

    if (selectableAides.length === 0) {
      throw new Error(`Aucune aide trouvée pour l'identifiant ${uuid}`);
    }

    return AideRepository.toAide(selectableAides[0]);
  }

  static toAide(selectableAide: Pick<Selectable<AideTable>, 'uuid' | 'nom' | 'description' | 'url'>): Aide {
    return new Aide(
      selectableAide.uuid as SUUID,
      selectableAide.nom,
      selectableAide.description || '',
      selectableAide.url
    );
  }
}

export const aideRepository = new AideRepository(db);
