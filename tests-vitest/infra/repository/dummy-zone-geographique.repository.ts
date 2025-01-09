import { ZoneGeographiqueRepositoryInterface } from '@/domain/repositories/zone-geographique-repository.interface';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { AtPerimeterScale } from '@/infra/at/perimeter';

export class DummyZoneGeographiqueRepository implements ZoneGeographiqueRepositoryInterface {
  all(): Promise<ZoneGeographique[]> {
    return Promise.resolve([]);
  }

  autocomplete(query: string): Promise<ZoneGeographique[]> {
    return Promise.resolve([]);
  }

  findOneByTypeAndCode(type: AtPerimeterScale, code: string): Promise<ZoneGeographique | null> {
    return Promise.resolve(null);
  }

  fromId(atId: ZoneGeographique['id']): Promise<ZoneGeographique> {
    return Promise.resolve({
      id: atId,
      nom: 'test',
      description: 'string',
      code: 'string',
      type: AtPerimeterScale.commune
    });
  }

  size(): Promise<number> {
    return Promise.resolve(0);
  }
}

// @ts-ignore
export const dummyZoneGeographiqueRepository = new DummyZoneGeographiqueRepository();
