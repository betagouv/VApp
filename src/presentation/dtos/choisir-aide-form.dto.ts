import { z } from 'zod';

export const choisirAideFormDtoSchema = z.object({
  aide_uuid: z.string().min(1, 'Vous devez choisir une aide.'),
  projet_uuid: z.string().min(1, 'Vous devez choisir un projet.')
});

export type ChoisirAideFormDto = z.infer<typeof choisirAideFormDtoSchema>;
