/**
 * Hack for union string litteral with string to keep autocomplete.
 *
 * Can be used in mapped type that output unwanted discriminated unions.
 *
 * @example
 * ```ts
 * type Discr = "A" | "B";
 * type DiscrMap = {
 *  "A": "alpha" | "beta",
 *  "B": "beta" | "gamma"
 * }
 * type T1 = {
 *  [P in Discr]: {
 *    discr: P,
 *    prop: DiscrMap[P];
 *  }
 * }[Discr];
 * type T2 = {
 *  [P in Discr]: {
 *    discr: P,
 *    prop: UniqueString<DiscrMap[P]> | DiscrMap[P]; // first part makes unique the litterals, second ensure autocomplete
 *  }
 * }[Discr];
 *
 * const bad: T1 = {
 *  discr: "A",
 *  prop: "gamma" // typed and autocomplete with `"alpha" | "beta" | "gama"`. Bad DX but still type safe.
 * }
 * const good: T2 = {
 *   discr: "A",
 *   prop: "alpha", // typed, autocompleted, and type safed with `"alpha" | "beta"`
 * };
 * ```
 */
export type UniqueString<TStr extends string = string> = TStr & {
  _?: never & symbol;
};

export type OmitStartsWith<T, K extends string> = {
  [Key in keyof T as Key extends `${K}${string}` ? never : Key]: T[Key];
};

type TypedFormDataValue = FormDataEntryValue | Blob;

/**
 * Polyfill for FormData Generic
 *
 * {@link https://github.com/microsoft/TypeScript/issues/43797}
 * {@link https://xhr.spec.whatwg.org/#interface-formdata}
 */
export interface TypedFormData<T extends Record<string, TypedFormDataValue>> {
  /**
   * Appends a new value onto an existing key inside a FormData object, or adds the key if
   * it does not already exist.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.append}
   */
  append<K extends keyof T>(name: K, value: T[K], fileName?: string): void;

  /**
   * Deletes a key/value pair from a FormData object.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.delete}
   */
  delete(name: keyof T): void;

  /**
   * Returns an iterator allowing to go through all key/value pairs contained in this object.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.entries}
   */
  entries<K extends keyof T>(): IterableIterator<[K, T[K]]>;

  /**
   * Returns the first value associated with a given key from within a FormData object.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.get}
   */
  get<K extends keyof T>(name: K): T[K] | null;

  /**
   * Returns an array of all the values associated with a given key from within a FormData.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.getall}
   */
  getAll<K extends keyof T>(name: K): Array<T[K]>;

  /**
   * Returns a boolean stating whether a FormData object contains a certain key.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.has}
   */
  has(name: keyof T): boolean;

  /**
   * Returns an iterator allowing to go through all keys of the key/value pairs contained in
   * this object.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.keys}
   */
  keys(): IterableIterator<keyof T>;

  /**
   * Sets a new value for an existing key inside a FormData object, or adds the key/value
   * if it does not already exist.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.set}
   */
  set(name: keyof T, value: TypedFormDataValue, fileName?: string): void;

  /**
   * Returns an iterator allowing to go through all values contained in this object.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/FormData#formdata.values}
   */
  values(): IterableIterator<T[keyof T]>;

  forEach<K extends keyof T>(
    callbackfn: (value: T[K], key: K, parent: TypedFormData<T>) => void,
    thisArg?: unknown
  ): void;
}

export type ClassProperties<C> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [Key in keyof C as C[Key] extends Function ? never : Key]: C[Key];
};

export interface AbortableAsyncIterator<T extends object> {
  abort(): void;
  [Symbol.asyncIterator](): AsyncGenerator<Awaited<T>, void, unknown>;
}
