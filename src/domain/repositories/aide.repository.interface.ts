import { Aide } from '../models/aide';

export interface AideRepositoryInterface {
  all(): Promise<Aide[]>;
  fromUuid(uuid: string): Promise<Aide>;
}
