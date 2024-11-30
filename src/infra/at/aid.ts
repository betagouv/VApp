import { z } from 'zod';

export const atAideTypeGroupSchema = z.object({
  id: z.number(),
  name: z.string()
});

export const atAideTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  group: atAideTypeGroupSchema
});

export type AtAideType = z.infer<typeof atAideTypeSchema>;

export const atFinancerFullSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string()
});

export const atAidSchema = z.object({
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
  financers_full: z.array(atFinancerFullSchema),
  destinations: z.array(z.string()),
  mobilization_steps: z.array(z.string()),
  is_charged: z.boolean().optional(),
  aid_types: z.array(z.string()),
  aid_types_full: z.array(atAideTypeSchema),
  programs: z.array(z.string()),
  categories: z.array(z.string())
});

export type AtAid = z.infer<typeof atAidSchema>;
