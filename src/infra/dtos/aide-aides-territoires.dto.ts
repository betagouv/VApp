import { z } from 'zod';

export const aideAidesTerritoiresDtoSchema = z
  .object({
    id: z.coerce
      .number({
        invalid_type_error: "L'id aides et territoires est supposé être un entier."
      })
      .int()
      .min(1, "L'id aides et territoires est supposé être supérieur à 0."),
    nom: z.string().min(1, 'Une aide  aides et territoires doit avoir un nom'),
    description: z.string().min(1, 'Une aide  aides et territoires doit avoir une description')
  })
  .strict();

export type AideAidesTerritoiresDto = z.infer<typeof aideAidesTerritoiresDtoSchema>;
