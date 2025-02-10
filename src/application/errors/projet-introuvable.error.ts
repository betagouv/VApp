import { ApplicationErrorInterface } from '@/application/errors/apllication-error.interface';

export class ProjetIntrouvableError extends Error implements ApplicationErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'ProjetIntrouvableError';

    Object.setPrototypeOf(this, ProjetIntrouvableError.prototype);
  }
}
