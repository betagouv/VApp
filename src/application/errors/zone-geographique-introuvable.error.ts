export class ZoneGeographiqueIntrouvableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ZoneGeographiqueIntrouvableError';

    Object.setPrototypeOf(this, ZoneGeographiqueIntrouvableError.prototype);
  }
}
