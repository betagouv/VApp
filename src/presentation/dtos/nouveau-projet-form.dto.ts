import { z } from 'zod';

export const nouveauProjetFormDtoSchema = z.object({
  description: z.string().min(1, 'Vous devez décrire votre projet.'),
  uuid: z.string().optional(),
  audience: z.string().optional(),
  commune: z.string().optional(),
  territoireId: z.string().optional(),
  payante: z.string().optional(),
  etatsAvancements: z.array(z.string()).optional().or(z.string()),
  aideNatures: z.array(z.string()).optional().or(z.string()),
  actionsConcernees: z.array(z.string()).optional().or(z.string())
});

export type NouveauProjetFormDto = z.infer<typeof nouveauProjetFormDtoSchema>;
