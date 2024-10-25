import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const questionsFormDtoSchema = zfd.formData({
  projetId: z.string().min(1, 'Une série de question réponse doit être associée à un projet.'),
  aideId: z.string().min(1, 'Une série de question réponse doit être associée à une aide.'),
  questionsReponses: zfd.repeatable(
    z.array(
      z.object({
        question: zfd.text(),
        reponse: zfd.text()
      })
    )
  )
});

export type QuestionsFormDto = z.infer<typeof questionsFormDtoSchema>;
