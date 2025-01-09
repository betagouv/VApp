import { z } from '@/libs/validation';
import { projetCreatedDtoSchema, projetLinksDtoSchema } from '@/presentation/api/dtos/projet-created.dto';

export const projetResponseDtoSchema = z
  .object({
    data: projetCreatedDtoSchema,
    links: projetLinksDtoSchema
  })
  .openapi({
    description: "Création d'un projet afin de rechercher des aides"
  });

export type ProjetResponseDto = z.infer<typeof projetResponseDtoSchema>;
