import { ErrorInterface } from '@/libs/error.interface';

export class ProjetIntrouvableError extends Error implements ErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'ProjetIntrouvableError';

    Object.setPrototypeOf(this, ProjetIntrouvableError.prototype);
  }
}
