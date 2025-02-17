import { ErrorInterface } from '@/libs/error.interface';

export class ZoneGeographiqueIntrouvableError extends Error implements ErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'ZoneGeographiqueIntrouvableError';

    Object.setPrototypeOf(this, ZoneGeographiqueIntrouvableError.prototype);
  }
}
