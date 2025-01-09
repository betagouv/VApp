import { ZodError } from 'zod';

export function isValidationError(err: unknown): err is ZodError {
  return Boolean(err && (err instanceof ZodError || (err as ZodError).name === 'ZodError'));
}

export function zodErrorToMessage(err: ZodError): string {
  return err.issues.map(({ message }) => message).join(', ');
}
