import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { AtPerimeterScale } from '@/infra/at/perimeter';

export interface ZoneGeographiqueRepositoryInterface {
  all(): Promise<ZoneGeographique[]>;
  autocomplete(query: string): Promise<ZoneGeographique[]>;
  fromId(atId: ZoneGeographique['id']): Promise<ZoneGeographique>;
  size(): Promise<number>;
  findOneByTypeAndCode(type: AtPerimeterScale, code: string): Promise<ZoneGeographique | null>;
  findCommuneByCode(code: string): Promise<ZoneGeographique>;
}
