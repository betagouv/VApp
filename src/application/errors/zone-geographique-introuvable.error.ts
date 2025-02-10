import { ApplicationErrorInterface } from '@/application/errors/apllication-error.interface';

export class ZoneGeographiqueIntrouvableError extends Error implements ApplicationErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'ZoneGeographiqueIntrouvableError';

    Object.setPrototypeOf(this, ZoneGeographiqueIntrouvableError.prototype);
  }
}
