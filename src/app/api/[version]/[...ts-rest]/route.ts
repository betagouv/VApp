import { createNextHandler } from '@ts-rest/serverless/next';
import * as Sentry from '@sentry/nextjs';

import { aidesScoringUsecase, creerNouveauProjetUsecase } from '@/container';
import { aideEvalueeRepository } from '@/infra/repositories';
import { projetRepository } from '@/infra/repositories/projet.repository';

import { RechercherProjetAidesPagineesUsecase } from '@/application/usecases/rechercher-projet-aides-paginees.usecase';
import { AidesEvalueesPagineesHttpAdapter } from '@/presentation/api/adapters/aides-evaluees-paginees-http.adapter';
import { ZoneGeographiqueIntrouvableError } from '@/application/errors/zone-geographique-introuvable.error';

import { CreerNouveauProjetHttpAdapter } from '@/presentation/api/adapters/creer-nouveau-projet-http.adapter';
import { contract } from '@/presentation/api/contracts';
import { getProjetAidesRelativeLink } from '@/presentation/api/contracts/aides-contract';
import { authorizationMiddleware } from '@/presentation/api/authorization-middleware';
import { errorHandler } from '@/presentation/api/error-handler';
import { PageOutOfRangeError } from '@/application/errors/page-out-of-range.error';
import { AidesScoringHttpAdapter } from '@/presentation/api/adapters/aides-scoring-http.adapter';
import { UnauthorizedError } from '@/application/errors/unauthorized.error';
import { ApiRouteErrorResponse } from '@/presentation/api/api-route-error-response';

type GlobalRequestContext = {
  time: Date;
  clientId: string;
};

const handler = createNextHandler<typeof contract, GlobalRequestContext>(
  contract,
  {
    creerProjet: async ({ body }, { responseHeaders, request }) => {
      try {
        const projet = await creerNouveauProjetUsecase.execute(
          CreerNouveauProjetHttpAdapter.toInput(body.data, request.clientId)
        );
        responseHeaders.set('Location', getProjetAidesRelativeLink(projet));

        return {
          status: 201,
          body: CreerNouveauProjetHttpAdapter.toProjetResponseDto(projet)
        };
      } catch (e) {
        if (e instanceof ZoneGeographiqueIntrouvableError) {
          return ApiRouteErrorResponse.fromApplicationError(e, 404);
        }

        console.error(e);
        Sentry.captureException(e);
        return ApiRouteErrorResponse.fromMessage('Internal server error.');
      }
    },
    scoringAides: async ({ params: { projetId }, body }, { request }) => {
      try {
        const aidesScores = await aidesScoringUsecase.execute(
          AidesScoringHttpAdapter.toInput(projetId, body.data, request.clientId)
        );

        return {
          status: 200,
          body: AidesScoringHttpAdapter.toJsonApiResponse(aidesScores)
        };
      } catch (e) {
        if (e instanceof UnauthorizedError) {
          return ApiRouteErrorResponse.fromApplicationError(e, 401);
        }

        console.error(e);
        Sentry.captureException(e);
        return ApiRouteErrorResponse.fromMessage('Internal server error.', 500);
      }
    },
    rechercherAides: async ({ query, params: { projetId } }, { request }) => {
      try {
        const rechercherAidesEvalueesPagineesUsecase = new RechercherProjetAidesPagineesUsecase(
          projetRepository,
          aideEvalueeRepository
        );
        const aidesEvalueesPaginees = await rechercherAidesEvalueesPagineesUsecase.execute(
          AidesEvalueesPagineesHttpAdapter.toInput(projetId, query)
        );

        return {
          status: 200,
          body: AidesEvalueesPagineesHttpAdapter.toJsonAPICollection(aidesEvalueesPaginees, new URL(request.url))
        };
      } catch (e) {
        if (PageOutOfRangeError.is(e)) {
          return ApiRouteErrorResponse.fromApplicationError(e, 404);
        }

        console.error(e);
        Sentry.captureException(e);
        return ApiRouteErrorResponse.fromMessage('Internal server error.');
      }
    }
  },
  {
    jsonQuery: true,
    responseValidation: false,
    handlerType: 'app-router',
    errorHandler,
    requestMiddleware: process.env.NODE_ENV === 'development' ? [] : [authorizationMiddleware]
  }
);

export { handler as POST };
export { handler as GET };
