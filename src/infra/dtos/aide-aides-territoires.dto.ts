import { z } from 'zod';

export const atAideTypeGroup = z.object({
  id: z.number(),
  name: z.string()
});

export const atAideType = z.object({
  id: z.number(),
  name: z.string(),
  group: atAideTypeGroup
});

export const financerFullSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string()
});

export const aideAidesTerritoiresDtoSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Une aide  aides et territoires doit avoir un nom'),
  description: z.string(),
  description_md: z.string(),
  eligibility_md: z.string(),
  url: z.string(),
  targeted_audiences: z.array(z.string()),
  token_numb_description: z.number(),
  token_numb_eligibility: z.number(),
  perimeter: z.string(),
  perimeter_scale: z.string(),
  financers: z.array(z.string()),
  financers_full: z.array(financerFullSchema),
  destinations: z.array(z.string()),
  mobilization_steps: z.array(z.string()),
  is_charged: z.boolean().optional(),
  aid_types: z.array(z.string()),
  aid_types_full: z.array(atAideType)
});

export type AideAidesTerritoiresDto = z.infer<typeof aideAidesTerritoiresDtoSchema>;
