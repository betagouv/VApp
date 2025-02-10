import { ApplicationErrorInterface } from '@/application/errors/apllication-error.interface';

export class TerritoireRequisError extends Error implements ApplicationErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'TerritoireRequisError';

    Object.setPrototypeOf(this, TerritoireRequisError.prototype);
  }
}
