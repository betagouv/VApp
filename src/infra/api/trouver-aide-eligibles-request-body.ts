import { z } from '@/libs/zod';
import { AtOrganizationType } from '@/infra/at/organization-type';
import { AtAidStep } from '@/infra/at/aid-step';

export const territoireSchema = z.object({
  type: z.enum(['commune', 'epci']).openapi({ example: 'commune' }),
  code: z.string().openapi({ example: '12345' })
});

export const trouverAidesEligiblesRequestBodySchema = z
  .object({
    projet: z.string().optional().openapi({ example: 'Réhabilitation de bâtiments' }),
    beneficiaire: z.nativeEnum(AtOrganizationType).optional().openapi({ example: AtOrganizationType.Commune }),
    territoire: territoireSchema.optional(),
    payante: z.boolean().optional().openapi({ example: false }),
    etatsAvancements: z
      .array(z.nativeEnum(AtAidStep))
      .optional()
      .openapi({ example: [AtAidStep.Usage, AtAidStep.Realisation] }),
    natures: z.enum(['financial-group', 'technical-group']).optional().openapi({ example: 'technical-group' }),
    actionsConcernees: z.enum(['supply', 'investment']).optional().openapi({ example: 'supply' })
  })
  .openapi('TrouverAidesEligiblesRequestBody');
