import { z } from '@/libs/validation';
import { initContract } from '@ts-rest/core';

import type { Projet } from '@/domain/models/projet';
import { pathPrefix } from '@/presentation/api/path-prefix';
import { criteresRechercheAidesPagineesDtoSchema } from '@/presentation/api/dtos/criteres-recherche-aides.dto';
import { aidesResponseDtoSchema } from '@/presentation/api/dtos/aides-response.dto';
import { JsonApiErrorsSchema } from '@/presentation/api/json-api/errors';

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

export const getAbsoluteWidgetProjetAidesUrl = (projet: Pick<Projet, 'uuid'>) => {
  return new URL(`${pathPrefix}/widget/projets/${projet.uuid}/aides`, process.env.NEXT_PUBLIC_SITE_URL);
};
export const getAbsoluteWidgetProjetAidesLink = (projet: Pick<Projet, 'uuid'>) => {
  const url = getAbsoluteWidgetProjetAidesUrl(projet);
  return url.toString();
};

export const getWidgetProjetAidesLink = (projet: Pick<Projet, 'uuid'>) => {
  const url = getAbsoluteWidgetProjetAidesUrl(projet);

  return url.toString().substring(url.origin.length);
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
      projetId: z.string().uuid()
    }),
    summary: 'Rechercher des aides',
    description: `Recherche des **aides** pour l'identifiant **projet** (\`uuid\`) spécifié.
La collection d'aides est paginée mais non triée sur le score.
Pour faire ressortir les aides les plus compatibles avec le projet, il convient de trier les aides par \`scoreCompatibilite\` de manière descendante.

En effet, le *scoring* des aides étant un calcul coûteux, il est effectué page après page afin de permettre aux clients qui le souhaitent d'afficher des informations dès la première page.`,
    metadata: {
      openApiSecurity: [
        {
          'API Key': []
        }
      ]
    }
  }
});
