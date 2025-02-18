import * as Sentry from '@sentry/nextjs';
import { TsRestResponse } from '@ts-rest/serverless';
import { RequestValidationError } from '@ts-rest/serverless/next';
import { JsonApiErrorResponse } from '@/presentation/api/json-api/error-response';

export function isRequestValidationError(e: unknown): e is RequestValidationError {
  return Boolean(
    e && (e instanceof RequestValidationError || (e as RequestValidationError).name === 'RequestValidationError')
  );
}

export function isJsonParseError(e: unknown): e is RequestValidationError {
  return Boolean(e && (e instanceof SyntaxError || (e as SyntaxError).name === 'SyntaxError'));
}

export const errorHandler = (e: unknown) => {
  if (isJsonParseError(e)) {
    return TsRestResponse.fromJson(JsonApiErrorResponse.fromStatus(400, 'Invalid JSON'), { status: 400 });
  } else if (isRequestValidationError(e)) {
    return TsRestResponse.fromJson(JsonApiErrorResponse.fromRequestValidationError(e), { status: 400 });
  }

  console.error(e);
  Sentry.captureException(e);
  return TsRestResponse.fromJson(JsonApiErrorResponse.fromStatus(500, 'Internal server error.'), { status: 500 });
};
