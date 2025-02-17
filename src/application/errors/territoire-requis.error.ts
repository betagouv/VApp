import { ErrorInterface } from '@/libs/error.interface';

export class TerritoireRequisError extends Error implements ErrorInterface {
  constructor(message: string) {
    super(message);
    this.name = 'TerritoireRequisError';

    Object.setPrototypeOf(this, TerritoireRequisError.prototype);
  }
}
