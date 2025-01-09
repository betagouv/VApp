export class ProjetIntrouvableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjetIntrouvableError';

    Object.setPrototypeOf(this, ProjetIntrouvableError.prototype);
  }
}
