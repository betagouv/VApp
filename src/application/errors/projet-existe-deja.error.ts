import { ErrorInterface } from '@/libs/error.interface';

export class ProjetExisteDejaError extends Error implements ErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'ProjetExisteDejaError';

    Object.setPrototypeOf(this, ProjetExisteDejaError.prototype);
  }
}
