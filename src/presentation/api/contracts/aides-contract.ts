import { z } from '@/libs/validation';
import { initContract } from '@ts-rest/core';
import { pathPrefix } from '@/presentation/api/contracts/index';
import { criteresRechercheAidesPagineesDtoSchema } from '@/presentation/api/dtos/criteres-recherche-aides.dto';
import { aidesResponseDtoSchema } from '@/presentation/api/dtos/aides-response.dto';
import { JsonApiErrorsSchema } from '@/presentation/api/json-api/errors';
import type { Projet } from '@/domain/models/projet';

const c = initContract();

const projetAidesPath = '/projets/:projetId/aides';

export const getProjetAidesURL = ({ uuid }: Pick<Projet, 'uuid'>) => {
  return new URL(`${pathPrefix}${projetAidesPath.replace(':projetId', uuid)}`, process.env.NEXT_PUBLIC_SITE_URL);
};

export const getProjetAidesRelativeLink = ({ uuid }: Pick<Projet, 'uuid'>) => {
  const url = getProjetAidesURL({ uuid });
  return `${url.pathname}${url.search}`;
};

export const getProjetAidesAbsoluteLink = ({ uuid }: Pick<Projet, 'uuid'>) => getProjetAidesURL({ uuid }).toString();

export const getWidgetProjetAidesLink = (projet: Projet) => {
  const url = new URL(`widget/projets/${projet.uuid}/aides`, process.env.NEXT_PUBLIC_SITE_URL);
  return url.toString();
};

export const aidesContract = c.router({
  rechercherAides: {
    method: 'GET',
    path: projetAidesPath,
    responses: {
      200: aidesResponseDtoSchema,
      400: JsonApiErrorsSchema,
      404: JsonApiErrorsSchema,
      500: JsonApiErrorsSchema
    },
    query: criteresRechercheAidesPagineesDtoSchema,
    pathParams: z.object({
      projetId: z.string()
    }),
    summary: 'Rechercher des aides',
    description:
      "Recherche des **aides** pour l'identifiant **projet** (`uuid`) spécifié. La collection d'aides est paginée mais non triée sur le score. Pour faire ressortir les aides les plus compatibles avec le projet il convient de trier les aides par`scoreCompatibilite` descendant." +
      "En effet le *scoring* des aides étant un calcul coûteux il effectué page par page, pour permettre aux consommateurs qui le souhaite d'afficher des informations dès la première page.",
    metadata: {
      openApiSecurity: [
        {
          'API Key': []
        }
      ]
    }
  }
});
