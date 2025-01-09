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

export const creerProjetDtoSchema = z
  .object({
    id: z.string().uuid().optional().openapi({
      description: 'Un `uuid` généré par le client pour identifier le projet.'
    }),
    description: z.string().openapi({
      example: 'Réhabilitation de bâtiments',
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
        description: 'Liste de zone géographique concerné par le projet.',
        example: [
          {
            type: AtPerimeterScale.commune,
            code: 69266
          }
        ]
      }),
    etatAvancement: z
      .nativeEnum(LesCommunsProjetStatuts)
      .optional()
      .openapi({
        example: [LesCommunsProjetStatuts.IDEE, LesCommunsProjetStatuts.FAISABILITE],
        description: "Liste des statuts décrivant l'état d'avancement du projet."
      })
  })
  .openapi({
    description: "Création d'un projet afin de rechercher des aides"
  });

export type CreerProjetDto = z.infer<typeof creerProjetDtoSchema>;
