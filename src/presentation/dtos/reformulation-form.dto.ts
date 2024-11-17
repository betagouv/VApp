import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const reformulationFormDtoSchema = zfd.formData({
  projetId: z.string().min(1, 'Une série de question réponse doit être associée à un projet.'),
  reformulation: z.string().min(1, 'Une série de question réponse doit être associée à un projet.')
});

export type ReformulationFormDto = z.infer<typeof reformulationFormDtoSchema>;
