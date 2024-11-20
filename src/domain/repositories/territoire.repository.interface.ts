import { Territoire } from '@/domain/models/territoire';

export interface TerritoireRepositoryInterface {
  all(): Promise<Territoire[]>;
  autocomplete(query: string): Promise<Territoire[]>;
  fromUuid(uuid: string): Promise<Territoire>;
  size(): Promise<number>;
}
