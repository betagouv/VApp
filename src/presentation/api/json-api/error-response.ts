import { ZodError } from 'zod';
import { JsonApiErrorInterface } from '@/presentation/api/json-api/error';
import { RequestValidationError } from '@ts-rest/serverless/next';
import { fromZodError } from '@/presentation/api/json-api/errors';

export class JsonApiErrorResponse {
  constructor(public errors: JsonApiErrorInterface[] = []) {}

  static fromZodError(error: ZodError | null): JsonApiErrorResponse {
    return new JsonApiErrorResponse(fromZodError(error));
  }

  static fromRequestValidationError({
    pathParamsError,
    headersError,
    queryError,
    bodyError
  }: RequestValidationError): JsonApiErrorResponse {
    const statusCode = '400';
    return new JsonApiErrorResponse([
      ...fromZodError(pathParamsError, statusCode, 'pointer'),
      ...fromZodError(headersError, statusCode, 'header'),
      ...fromZodError(queryError, statusCode, 'parameter'),
      ...fromZodError(bodyError, statusCode, 'pointer')
    ]);
  }

  static fromStatus(status: string | number, title?: string): JsonApiErrorResponse {
    return new JsonApiErrorResponse([{ status: String(status), title }]);
  }
}
