// @ts-expect-error lib typings issue
import type { HTTPStatusCode } from '@ts-rest/core/src/lib/status-codes';
import { ApplicationErrorInterface } from '@/application/errors/apllication-error.interface';
import { JsonApiErrorResponse } from '@/presentation/api/json-api/error-response';

export class ApiRouteErrorResponse {
  public constructor(
    public readonly body: JsonApiErrorResponse,
    public readonly status: HTTPStatusCode
  ) {}

  static fromApplicationError(e: ApplicationErrorInterface, status: HTTPStatusCode = 400) {
    return new ApiRouteErrorResponse(JsonApiErrorResponse.fromStatus(status, e.message), status);
  }

  static fromMessage(message: string, status: HTTPStatusCode = 500) {
    return new ApiRouteErrorResponse(JsonApiErrorResponse.fromStatus(status, message), status);
  }
}
