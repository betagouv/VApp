import { z } from '@/libs/validation';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtAidDestination } from '@/infra/at/aid-destination';

export const criteresRechercheAidesDtoSchema = z
  .object({
    payante: z.coerce.boolean().optional().openapi({
      example: false,
      description: "Indique si l'aide recherchée est payante (true) ou gratuite (false)."
    }),
    natures: z
      .array(z.nativeEnum(AtAidTypeGroup))
      .optional()
      .openapi({
        example: [AtAidTypeGroup.Financiere],
        description: "Liste des natures d'aides recherchées (ex: Financiere, Technique, etc.)."
      }),
    actionsConcernees: z
      .array(z.nativeEnum(AtAidDestination))
      .optional()
      .openapi({
        example: [AtAidDestination.Investissement],
        description: "Liste des actions ou destinations visées par l'aide."
      })
  })
  .openapi({
    description: 'Ensemble des critères permettant de filtrer les aides.'
  });

export type CriteresRechercheAidesDto = z.infer<typeof criteresRechercheAidesDtoSchema>;

export const criteresRechercheAidesPagineesDtoSchema = z
  .object({
    page: z.number().optional()
  })
  .merge(criteresRechercheAidesDtoSchema)
  .openapi({
    description: 'Ensemble des critères permettant de filtrer les aides en fonction du projet.'
  });

export type CriteresRechercheAidesPagineesDto = z.infer<typeof criteresRechercheAidesPagineesDtoSchema>;
