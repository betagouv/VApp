export function toArrayOrUndefined<T>(data?: unknown | unknown[]): T[] | undefined {
  if (typeof data === 'undefined') {
    return;
  }

  if (Array.isArray(data)) {
    return data as T[];
  } else {
    return [data as T];
  }
}
