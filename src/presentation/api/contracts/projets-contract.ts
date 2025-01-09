import { z } from '@/libs/validation';
import { initContract } from '@ts-rest/core';
import { creerProjetDtoSchema } from '@/presentation/api/dtos/creer-projet.dto';
import { projetCreatedDtoSchema, projetLinksDtoSchema } from '@/presentation/api/dtos/projet-created.dto';
import { JsonApiErrorsSchema } from '@/presentation/api/json-api/errors';

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
    description:
      "Créer un **projet** afin de rechercher les **aides disponibles** avec leurs **score de compatibilité**. Suite à la création du projet, un **widget** est disponible pour embarquer l'affichage de la liste des aides.",
    metadata: {
      openApiSecurity: [
        {
          'API Key': []
        }
      ]
    }
  }
});
