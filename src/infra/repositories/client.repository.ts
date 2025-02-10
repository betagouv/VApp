import { Insertable, Kysely, Selectable } from 'kysely';
import { UUID } from 'short-uuid';
import { Client } from '@/domain/models/client';
import { ClientRepositoryInterface } from '@/domain/repositories/client.repository.interface';
import { DB, ClientTable } from '../database/types';
import { db } from '../database';

export class ClientRepository implements ClientRepositoryInterface {
  constructor(public db: Kysely<DB>) {}

  async add(client: Client): Promise<void> {
    await this.db.insertInto('client_table').values(ClientRepository.toInsertable(client)).execute();
  }

  async fromId(id: UUID): Promise<Client> {
    const rows = await this.db
      .selectFrom('client_table as c')
      .select(['c.id', 'c.nom', 'c.hashed_secret', 'c.salt', 'c.iterations', 'c.active'])
      .where('c.id', '=', id)
      .execute();

    if (rows.length === 0) {
      throw new Error(`Aucun client trouvé pour l'identifiant ${id}`);
    }

    return await this.toClient(rows[0]);
  }

  async fromNom(nom: string): Promise<Client> {
    const rows = await this.db
      .selectFrom('client_table as c')
      .select(['c.id', 'c.nom', 'c.hashed_secret', 'c.salt', 'c.iterations', 'c.active'])
      .where('c.nom', '=', nom)
      .execute();

    if (rows.length === 0) {
      throw new Error(`Aucun client portant le nom "${nom}" trouvé."`);
    }

    return await this.toClient(rows[0]);
  }

  static toInsertable(client: Client): Insertable<ClientTable> {
    return {
      id: client.id,
      iterations: client.iterations,
      hashed_secret: client.hashedSecret,
      nom: client.nom,
      salt: client.salt
    };
  }

  async toClient(selectable: Omit<Selectable<ClientTable>, 'created_at'>): Promise<Client> {
    return new Client(
      selectable.id as UUID,
      selectable.iterations,
      selectable.hashed_secret,
      selectable.nom,
      selectable.salt
    );
  }
}

export const clientRepository = new ClientRepository(db);
