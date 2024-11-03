import type { Kysely, Selectable } from 'kysely';
import { SUUID } from 'short-uuid';
import { AideAidesTerritoiresDto } from '@/infra/dtos/aide-aides-territoires.dto';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { Aide } from '@/domain/models/aide';
import { AideTable, DB } from '../database/types';
import { db } from '../database';

export class AideRepository implements AideRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async addFromAideTerritoires(aide: AideAidesTerritoiresDto) {
    const decoded = aide.targeted_audiences
      .replaceAll(", '", ', "')
      .replaceAll("', ", '", ')
      .replaceAll("['", '["')
      .replaceAll("']", '"]');
    console.log(decoded);
    await this.db
      .insertInto('aide_table')
      .values({
        uuid: Aide.createUuid(),
        nom: aide.name,
        description: aide.description_md,
        criteres_eligibilite: aide.eligibility_md,
        aides_territoire_id: Number(aide.id),
        url: aide.url,
        targeted_audiences: JSON.stringify(JSON.parse(decoded))
      })
      .execute();

    return Promise.resolve();
  }

  select() {
    return this.db.selectFrom('aide_table as a').select(['a.uuid', 'a.nom', 'a.description', 'a.url']);
  }

  async all() {
    const selectableProjets = await this.select().execute();

    return selectableProjets.map(AideRepository.toAide);
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
    return new Aide(selectableAide.uuid as SUUID, selectableAide.nom, selectableAide.description, selectableAide.url);
  }
}

export const aideRepository = new AideRepository(db);
