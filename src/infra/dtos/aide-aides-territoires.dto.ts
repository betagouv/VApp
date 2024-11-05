import { z } from 'zod';

export const aideAidesTerritoiresDtoSchema = z.object({
  id: z.string().min(1, 'Une aide  aides et territoires doit avoir un id'),
  name: z.string().min(1, 'Une aide  aides et territoires doit avoir un nom'),
  description_md: z.string(),
  eligibility_md: z.string(),
  url: z.string(),
  targeted_audiences: z.string(),
  token_numb_description: z.string().min(1),
  token_numb_eligibility: z.string().min(1),
  perimeter: z.string(),
  perimeter_scale: z.string(),
  financers: z.string(),
  financers_full: z.string()
});

export type AideAidesTerritoiresDto = z.infer<typeof aideAidesTerritoiresDtoSchema>;
