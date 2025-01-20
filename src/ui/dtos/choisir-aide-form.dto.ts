import { z } from 'zod';

export const choisirAideFormDtoSchema = z.object({
  aideUuid: z.string().min(1, 'Vous devez choisir une aide.'),
  projetUuid: z.string().min(1, 'Vous devez choisir un projet.')
});

export type ChoisirAideFormDto = z.infer<typeof choisirAideFormDtoSchema>;
