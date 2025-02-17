import { ErrorInterface } from '@/libs/error.interface';

export class ComputeServiceNotAvailableError extends Error implements ErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'ComputeServiceNotAvailableError';

    Object.setPrototypeOf(this, ComputeServiceNotAvailableError.prototype);
  }
}
