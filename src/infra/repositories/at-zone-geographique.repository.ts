import type { Kysely, Selectable } from 'kysely';
import { ZoneGeographiqueRepositoryInterface } from '@/domain/repositories/zone-geographique-repository.interface';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { AtPerimeter, AtPerimeterScale } from '@/infra/at/perimeter';
import { DB, AtPerimeterTable } from '../database/types';
import { db } from '../database';

export class AtZoneGeographiqueRepository implements ZoneGeographiqueRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async addFromPerimeter(perimeter: AtPerimeter): Promise<void> {
    await this.db
      .insertInto('at_perimeter_table')
      .values({ ...perimeter })
      .execute();
  }

  async all() {
    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.text', 'p.name', 'p.id', 'p.code', 'p.scale'])
      .execute();

    return selectables.map(AtZoneGeographiqueRepository.fromSelectable);
  }

  async size() {
    const { size } = await this.db
      .selectFrom('at_perimeter_table')
      .select(db.fn.countAll().as('size'))
      .executeTakeFirstOrThrow();

    return size as number;
  }

  async autocomplete(query: string | null): Promise<ZoneGeographique[]> {
    if (!query) {
      return [];
    }

    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.text', 'p.name', 'p.id', 'p.code', 'p.scale'])
      .where('p.name', 'ilike', `${query}%`)
      .limit(10)
      .execute();

    return selectables.map(AtZoneGeographiqueRepository.fromSelectable);
  }

  async findCommuneByCode(code: string) {
    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.name', 'p.text', 'p.id', 'p.code', 'p.scale'])
      .where('p.code', '=', code)
      .where('p.scale', '=', AtPerimeterScale.commune)
      .execute();

    if (selectables.length === 0) {
      throw new Error(`Aucuns commune portant le code INSEE ${code} n'a été trouvée.`);
    }

    return AtZoneGeographiqueRepository.fromSelectable(selectables[0]);
  }

  async findOneByTypeAndCode(type: AtPerimeterScale, code: string) {
    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.name', 'p.text', 'p.id', 'p.code', 'p.scale'])
      .where('p.code', '=', code)
      .where('p.scale', '=', type)
      .execute();

    if (selectables.length === 0) {
      return null;
    }

    return AtZoneGeographiqueRepository.fromSelectable(selectables[0]);
  }

  private static fromSelectable({
    name,
    text,
    id,
    code,
    scale
  }: Pick<Selectable<AtPerimeterTable>, 'name' | 'text' | 'id' | 'code' | 'scale'>): ZoneGeographique {
    return {
      id,
      nom: name,
      description: text,
      code,
      type: scale as AtPerimeterScale
    };
  }

  async fromId(atId: ZoneGeographique['id']): Promise<ZoneGeographique> {
    const selectables = await this.db
      .selectFrom('at_perimeter_table as p')
      .select(['p.uuid', 'p.name', 'p.text', 'p.id', 'p.code', 'p.scale'])
      .where('p.id', '=', atId)
      .execute();

    if (selectables.length === 0) {
      throw new Error(`Aucunes zones geographique trouvé pour l'identifiant AT ${atId}`);
    }

    return AtZoneGeographiqueRepository.fromSelectable(selectables[0]);
  }
}

export const atZoneGeographiqueRepository = new AtZoneGeographiqueRepository(db);
