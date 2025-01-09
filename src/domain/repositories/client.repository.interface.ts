import { UUID } from 'short-uuid';
import { Client } from '@/domain/models/client';

export interface ClientRepositoryInterface {
  add(client: Client): Promise<void>;
  fromId(uuid: UUID): Promise<Client>;
}
