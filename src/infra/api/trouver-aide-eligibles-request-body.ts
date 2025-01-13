import { z } from '@/libs/zod';
import { AtOrganizationType } from '@/infra/at/organization-type';
import { AtAidStep } from '@/infra/at/aid-step';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtAidDestination } from '@/infra/at/aid-destination';

export const territoireSchema = z.object({
  type: z.enum(['commune', 'epci']).openapi({ example: 'commune' }),
  code: z.string().openapi({ example: '12345' })
});

function coerceToArray<Schema extends z.ZodArray<z.ZodTypeAny>>(schema: Schema) {
  return z.union([z.any().array(), z.any().transform((x) => [x])]).pipe(schema);
}

export const trouverAidesEligiblesRequestBodySchema = z
  .object({
    projet: z.string().optional().openapi({ example: 'Réhabilitation de bâtiments' }),
    beneficiaire: z.nativeEnum(AtOrganizationType).optional().openapi({ example: AtOrganizationType.Commune }),
    territoireType: z.enum(['commune', 'epci']).openapi({ example: 'commune' }),
    territoireCode: z.string().openapi({ example: '12345' }),
    payante: z.coerce.boolean().optional().openapi({ example: false }),
    etatsAvancements: z
      .array(z.nativeEnum(AtAidStep))
      .optional()
      .openapi({ example: [AtAidStep.Usage, AtAidStep.Realisation] }),
    natures: z
      .array(z.nativeEnum(AtAidTypeGroup))
      .optional()
      .openapi({ example: [AtAidTypeGroup.Financiere] }),
    actionsConcernees: z
      .array(z.nativeEnum(AtAidDestination))
      .optional()
      .openapi({ example: [AtAidDestination.Investissement] })
  })
  .openapi('TrouverAidesEligiblesRequestBody');
