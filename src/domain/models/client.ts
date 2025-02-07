import { encodeApiKey, hashSecret } from '@/presentation/api/security';
import { UUID, uuid } from 'short-uuid';

export class Client {
  constructor(
    public id: UUID,
    public iterations: number,
    public hashedSecret: string,
    public nom: string,
    public salt: string
  ) {}

  static async fromSecretAndNom(secret: string, nom: string): Promise<Client> {
    const { hashedSecret, salt, iterations } = await hashSecret(secret);
    return new Client(uuid(), iterations, hashedSecret, nom, salt);
  }

  createApiKey(secret: string): string {
    return encodeApiKey(this.id, secret);
  }
}
