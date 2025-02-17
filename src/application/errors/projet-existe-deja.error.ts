import { ApplicationErrorInterface } from '@/application/errors/apllication-error.interface';

export class ProjetExisteDejaError extends Error implements ApplicationErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'ProjetExisteDejaError';

    Object.setPrototypeOf(this, ProjetExisteDejaError.prototype);
  }
}
