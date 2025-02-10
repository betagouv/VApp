import { z } from 'zod';

export const aideScoreDtoSchema = z.object({
  id: z.string().describe('Identifiant unique de l’aide (ex: "162955")'),
  scoreCompatibilite: z.number().int().min(0).max(100).describe('Score de compatibilité interne, sur 100')
});

export type AideScoreDto = z.infer<typeof aideScoreDtoSchema>;
