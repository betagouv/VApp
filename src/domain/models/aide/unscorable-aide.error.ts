import { ErrorInterface } from '@/libs/error.interface';

export class UnscorableAideError extends Error implements ErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'UnscorableAideError';

    Object.setPrototypeOf(this, UnscorableAideError.prototype);
  }
}
