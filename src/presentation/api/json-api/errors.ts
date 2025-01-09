import { z } from '@/libs/validation';
import { ZodError } from 'zod';
import { JsonApiError, JsonApiErrorSchema, SourceType } from '@/presentation/api/json-api/error';

export const fromZodError = (
  error: ZodError | null,
  status: string = '400',
  sourceType: SourceType = 'pointer'
): JsonApiError[] => (error ? error.issues.map((issue) => JsonApiError.fromZodIssue(issue, status, sourceType)) : []);

export const JsonApiErrorsSchema = z.object({
  errors: z.array(JsonApiErrorSchema)
});
