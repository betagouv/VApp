import { z } from '@/libs/validation';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { AtPerimeterScale } from '@/infra/at/perimeter';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { zoneGeographiqueDtoSchema } from '@/presentation/api/dtos/zone-geographique.dto';

export const territoireDtoSchema = z
  .object({
    type: z.nativeEnum(AtPerimeterScale).openapi({
      example: AtPerimeterScale.commune,
      description: 'Type de périmètre géographique (commune, département, etc.).'
    }),
    code: z.number().openapi({
      example: 69266,
      description: "Code identifiant le périmètre (par ex. code INSEE d'une commune)."
    })
  })
  .openapi({
    description: 'Un périmètre géographique unique, combinant un type et un code.'
  });

export type TerritoireDto = z.infer<typeof territoireDtoSchema>;

export const creerProjetDtoSchema = z.object({
  id: z.string().uuid().optional().openapi({
    description: 'Un `uuid` généré par le client pour identifier le projet.'
  }),
  description: z.string().openapi({
    example: "Revitalisation d'une zone humide",
    description: 'Brève description du projet.'
  }),
  porteur: z.nativeEnum(AtOrganizationTypeSlug).openapi({
    example: AtOrganizationTypeSlug.Commune,
    description: "Type d'organisation porteuse du projet (Commune, Association, etc.)."
  }),
  zonesGeographiques: z
    .array(zoneGeographiqueDtoSchema)
    .optional()
    .openapi({
      description: `Liste de zone géographique concerné par le projet. La propriété **type** peut prendre les valeurs suivantes: ${Object.values(
        AtPerimeterScale
      )
        .map((type) => `\`${type}\``)
        .join(', ')}.`,
      example: [
        {
          type: AtPerimeterScale.commune,
          code: 69266
        }
      ]
    }),
  etatAvancement: z.nativeEnum(LesCommunsProjetStatuts).optional().openapi({
    example: LesCommunsProjetStatuts.IDEE,
    description:
      "Statut décrivant l'état d'avancement du projet, tel que spécifié [des communs de la transition écologique des collectivités](https://github.com/betagouv/communs-de-la-transition-ecologique-des-collectivites/blob/main/api/CONNECTING_SERVICE.md#status)."
  })
});

export type CreerProjetDto = z.infer<typeof creerProjetDtoSchema>;
