import { z } from '@/libs/validation';
import { AtPerimeterScale } from '@/infra/at/perimeter';

export const zoneGeographiqueDtoSchema = z
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

export type ZoneGeographiqueDto = z.infer<typeof zoneGeographiqueDtoSchema>;
