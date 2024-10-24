import { ZodError } from 'zod';

export function isZodError(err: unknown): err is ZodError {
  return Boolean(err && (err instanceof ZodError || (err as ZodError).name === 'ZodError'));
}
