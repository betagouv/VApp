import type { Kysely, Selectable } from 'kysely';
import { SUUID } from 'short-uuid';
import { AideTable, DB } from '../database/types';
import { db } from '../database';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { AideAidesTerritoiresDto } from '@/infra/dtos/aide-aides-territoires.dto';
import { Aide } from '@/domain/models/aide';

export class AideRepository implements AideRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async addFromAideTerritoires(aide: AideAidesTerritoiresDto) {
    await this.db
      .insertInto('aide_table')
      .values({
        uuid: Aide.createUuid(),
        nom: aide.nom,
        description: aide.description,
        aides_territoire_id: aide.id
      })
      .execute();

    return Promise.resolve();
  }

  async all() {
    const selectableProjets = await this.db
      .selectFrom('aide_table as a')
      .select(['a.uuid', 'a.nom', 'a.description'])
      .execute();

    return selectableProjets.map(AideRepository.toAide);
  }

  async fromUuid(uuid: string): Promise<Aide> {
    const selectableAides = await this.db
      .selectFrom('aide_table as a')
      .select(['a.uuid', 'a.nom', 'a.description'])
      .where('a.uuid', '=', uuid)
      .execute();

    if (selectableAides.length === 0) {
      throw new Error(`Aucune aide trouvée pour l'identifiant ${uuid}`);
    }

    return AideRepository.toAide(selectableAides[0]);
  }

  static toAide(selectableAide: Pick<Selectable<AideTable>, 'uuid' | 'nom' | 'description'>): Aide {
    return new Aide(selectableAide.uuid as SUUID, selectableAide.nom, selectableAide.description);
  }
}

export const aideRepository = new AideRepository(db);
