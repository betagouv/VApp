import { ErrorInterface } from '@/libs/error.interface';

export class UnauthorizedError extends Error implements ErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
