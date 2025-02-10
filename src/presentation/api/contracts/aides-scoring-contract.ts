import { z } from '@/libs/validation';
import { initContract } from '@ts-rest/core';
import { JsonApiErrorsSchema } from '@/presentation/api/json-api/errors';
import { aidesScoringResponseDtoSchema } from '@/presentation/api/dtos/aides-scoring-response.dto';
import { aidesScoringRequestDtoSchema } from '@/presentation/api/dtos/aides-scoring-request.dto';

const c = initContract();

const projetAidesScoringPath = '/projets/:projetId/aides/scoring';

export const aidesScoringContract = c.router({
  scoringAides: {
    method: 'POST',
    path: projetAidesScoringPath,
    responses: {
      200: aidesScoringResponseDtoSchema,
      400: JsonApiErrorsSchema,
      404: JsonApiErrorsSchema,
      500: JsonApiErrorsSchema
    },
    pathParams: z.object({
      projetId: z.string()
    }),
    body: aidesScoringRequestDtoSchema,
    summary: 'Attribuer des scores',
    description: 'Attribuer des scores de compatibilités aux aides de votre choix.',
    metadata: {
      openApiSecurity: [
        {
          'API Key': []
        }
      ]
    }
  }
});
