import { ApplicationErrorInterface } from '@/application/errors/apllication-error.interface';

export class UnauthorizedError extends Error implements ApplicationErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
