import { Aide } from '../models/aide';

export interface AideRepositoryInterface {
  all(): Promise<Aide[]>;
  findAllForAudience(audience: string): Promise<Aide[]>;
  fromUuid(uuid: string): Promise<Aide>;
  size(): Promise<number>;
}
