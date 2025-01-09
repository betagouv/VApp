import * as Sentry from '@sentry/nextjs';
import { TsRestResponse } from '@ts-rest/serverless';
import { RequestValidationError } from '@ts-rest/serverless/next';
import { JsonApiErrorResponse } from '@/presentation/api/json-api/error-response';

export function isRequestValidationError(err: unknown): err is RequestValidationError {
  return Boolean(
    err && (err instanceof RequestValidationError || (err as RequestValidationError).name === 'RequestValidationError')
  );
}

export const errorHandler = (e: unknown) => {
  if (isRequestValidationError(e)) {
    return TsRestResponse.fromJson(JsonApiErrorResponse.fromRequestValidationError(e), { status: 400 });
  }

  console.error(e);
  Sentry.captureException(e);
  return TsRestResponse.fromJson(JsonApiErrorResponse.fromStatus(500, 'Internal server error.'), { status: 500 });
};
