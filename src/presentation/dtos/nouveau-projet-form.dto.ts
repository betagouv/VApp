import { z } from 'zod';

export const nouveauProjetFormDtoSchema = z.object({
  description: z.string().min(1, 'Vous devez décrire votre projet.'),
  uuid: z.string().optional()
});

export type NouveauProjetFormDto = z.infer<typeof nouveauProjetFormDtoSchema>;
