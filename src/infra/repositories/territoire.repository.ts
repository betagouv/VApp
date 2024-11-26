import type { Kysely, Selectable } from 'kysely';
import { DB, AtPerimeterTable } from '../database/types';
import { db } from '../database';
import { AtApiClientInterface } from '@/infra/at/at-api-client.interface';
import { atApiClient } from '@/infra/at/api-client';
import { TerritoireRepositoryInterface } from '@/domain/repositories/territoire.repository.interface';
import { Territoire } from '@/domain/models/territoire';
import { AtPerimeter } from '@/infra/at/perimeter';

export class TerritoireRepository implements TerritoireRepositoryInterface {
  constructor(
    public db: Kysely<DB>,
    public atApiClient: AtApiClientInterface
  ) {}

  async fromUuid(uuid: string): Promise<Territoire> {
    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.name', 'p.text', 'p.id'])
      .where('p.uuid', '=', uuid)
      .execute();

    if (selectables.length === 0) {
      throw new Error(`Aucuns territoire trouvé pour l'identifiant ${uuid}`);
    }

    return TerritoireRepository.fromSelectable(selectables[0]);
  }

  async addFromPerimeter(perimeter: AtPerimeter): Promise<void> {
    await this.db
      .insertInto('at_perimeter_table')
      .values({ ...perimeter })
      .execute();
  }

  async all() {
    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.text', 'p.name', 'p.id'])
      .execute();

    return selectables.map(TerritoireRepository.fromSelectable);
  }

  async size() {
    const { size } = await this.db
      .selectFrom('at_perimeter_table')
      .select(db.fn.countAll().as('size'))
      .executeTakeFirstOrThrow();

    return size as number;
  }

  async autocomplete(query: string | null): Promise<Territoire[]> {
    if (!query) {
      return [];
    }

    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.text', 'p.name', 'p.id'])
      .where('p.name', 'ilike', `${query}%`)
      .limit(10)
      .execute();

    return selectables.map(TerritoireRepository.fromSelectable);
  }

  private static fromSelectable({
    uuid,
    name,
    text,
    id
  }: Pick<Selectable<AtPerimeterTable>, 'uuid' | 'name' | 'text' | 'id'>): Territoire {
    return {
      uuid,
      nom: name,
      description: text,
      aidesTerritoiresId: id
    };
  }
}

export const territoireRepository = new TerritoireRepository(db, atApiClient);
