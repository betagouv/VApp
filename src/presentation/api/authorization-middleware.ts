import { UUID } from 'short-uuid';
import * as Sentry from '@sentry/nextjs';
import { tsr } from '@ts-rest/serverless/next';
import { TsRestResponse } from '@ts-rest/serverless';
import { JsonApiErrorResponse } from '@/presentation/api/json-api/error-response';
import { decodeApiKey, verifySecret } from '@/presentation/api/security';
import { clientRepository } from '@/infra/repositories/client.repository';

export const authorizationMiddleware = tsr.middleware<{ clientId: string }>(async (request) => {
  const apiKey = request.headers.get('x-api-Key');
  if (!apiKey) {
    return TsRestResponse.fromJson(JsonApiErrorResponse.fromStatus(401, 'Missing API key'), { status: 401 });
  }

  if (request.headers.get('x-api-Key')) {
    try {
      const { secret, clientId } = decodeApiKey(apiKey);
      const { salt, iterations, hashedSecret } = await clientRepository.fromId(clientId as UUID);
      const verified = await verifySecret(secret, hashedSecret, salt, iterations);
      if (!verified) {
        return TsRestResponse.fromJson(JsonApiErrorResponse.fromStatus(401, 'Unauthorized'), { status: 401 });
      }

      request.clientId = clientId;

      Sentry.setContext('client', {
        id: clientId
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return TsRestResponse.fromJson(JsonApiErrorResponse.fromStatus(401, 'Unauthorized'), { status: 401 });
    }
  }
});
