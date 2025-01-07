import { z } from 'zod';

/**
 * @see src/domain/prompts/questions.ts
 * {{"Q1": str, "Q2": str, "Q3": str}}
 */
export const ollamaQuestionsDtoSchema = z
  .object({
    Q1: z.string().min(1, 'La question n°1 ne doit pas être vide.'),
    Q2: z.string().min(1, 'La question n°2 ne doit pas être vide.'),
    Q3: z.string().min(1, 'La question n°3 ne doit pas être vide.')
  })
  .strict();

export type OllamaQuestionsDto = z.infer<typeof ollamaQuestionsDtoSchema>;
