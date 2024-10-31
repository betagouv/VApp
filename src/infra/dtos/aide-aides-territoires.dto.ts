import { z } from 'zod';

export const aideAidesTerritoiresDtoSchema = z.object({
  id: z.string().min(1, 'Une aide  aides et territoires doit avoir un id'),
  name: z.string().min(1, 'Une aide  aides et territoires doit avoir un nom'),
  description_md: z.string().min(1, 'Une aide  aides et territoires doit avoir une description'),
  eligibility_md: z.string()
});

export type AideAidesTerritoiresDto = z.infer<typeof aideAidesTerritoiresDtoSchema>;
