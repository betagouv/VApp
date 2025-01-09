export class TerritoireRequisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TerritoireRequisError';

    Object.setPrototypeOf(this, TerritoireRequisError.prototype);
  }
}
