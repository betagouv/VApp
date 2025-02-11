import { z } from '@/libs/validation';
import { initContract } from '@ts-rest/core';
import { creerProjetDtoSchema } from '@/presentation/api/dtos/creer-projet.dto';
import { projetCreatedDtoSchema, projetLinksDtoSchema } from '@/presentation/api/dtos/projet-created.dto';
import { JsonApiErrorsSchema } from '@/presentation/api/json-api/errors';
import { getAbsoluteWidgetProjetAidesLink } from '@/presentation/api/contracts/aides-contract';
import { uuid } from 'short-uuid';

const c = initContract();

export const projetsContract = c.router({
  creerProjet: {
    method: 'POST',
    path: '/projets',
    responses: {
      201: z.object({
        data: projetCreatedDtoSchema,
        links: projetLinksDtoSchema
      }),
      400: JsonApiErrorsSchema,
      500: JsonApiErrorsSchema
    },
    body: z.object({
      data: creerProjetDtoSchema
    }),
    summary: 'Créer un projet',
    description: `Créer un **projet** afin de rechercher les **aides disponibles** avec leurs **score de compatibilité**.

Le lien vers le **widget** d'affichage des aides est disponible dans la section **liens** de la réponse \`data.links.widget\`.
Ce **widget** permet d'embarquer la liste des aides dans votre environnement à l'aide d'une **iframe** :
\`\`\`html
<iframe src="${getAbsoluteWidgetProjetAidesLink({ uuid: uuid() })}" />
\`\`\`
`,
    metadata: {
      openApiSecurity: [
        {
          'API Key': []
        }
      ]
    }
  }
});
