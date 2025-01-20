import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const projetDescriptionFormDtoSchema = zfd.formData({
  uuid: z.string().min(1, 'Impossible de trouver un projet sans son identifiant.'),
  description: z.string().min(1, 'Veuillez décrire votre projet.')
});

export type ProjetDescriptionFormDto = z.infer<typeof projetDescriptionFormDtoSchema>;
