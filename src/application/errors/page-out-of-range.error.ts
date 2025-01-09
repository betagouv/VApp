export class PageOutOfRangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PageOutOfRangeError';

    Object.setPrototypeOf(this, PageOutOfRangeError.prototype);
  }

  static is(err: unknown): err is PageOutOfRangeError {
    return Boolean(
      err && (err instanceof PageOutOfRangeError || (err as PageOutOfRangeError).name === 'PageOutOfRangeError')
    );
  }
}
