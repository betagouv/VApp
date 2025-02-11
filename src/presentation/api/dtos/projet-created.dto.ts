import { z } from '@/libs/validation';
import { uuid } from 'short-uuid';
import { creerProjetDtoSchema } from '@/presentation/api/dtos/creer-projet.dto';
import { getProjetAidesRelativeLink, getWidgetProjetAidesLink } from '@/presentation/api/contracts/aides-contract';

const id = uuid();

export const projetCreatedDtoSchema = creerProjetDtoSchema.merge(
  z.object({
    id: z.string().uuid().openapi({
      example: id,
      description: "L'identifiant fourni à la création du projet ou un `uuid` généré par le serveur."
    }),
    clientId: z.string().uuid().optional().openapi({
      example: uuid,
      description: "Identifiant du service à l'initiative du projet."
    })
  })
);

export const projetLinksDtoSchema = z.object({
  widget: z
    .string()
    .url()
    .openapi({
      example: getProjetAidesRelativeLink({ uuid: id }),
      description: "Le lien relatif vers le **widget** permettant d'afficher les aides compatibles au projet."
    }),
  aides: z
    .string()
    .url()
    .openapi({
      example: getWidgetProjetAidesLink({ uuid: id }),
      description: "Le lien relatif vers le point d'entrée permettant de rechercher des aides."
    })
});
