import { z } from '@/libs/validation';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { zoneGeographiqueDtoSchema } from '@/presentation/api/dtos/zone-geographique.dto';

export const projetCreatedDtoSchema = z.object({
  id: z.string().uuid(),
  description: z.string(),
  porteur: z.nativeEnum(AtOrganizationTypeSlug),
  etatAvancement: z.nativeEnum(LesCommunsProjetStatuts).optional(),
  zonesGeographiques: z.array(zoneGeographiqueDtoSchema).optional(),
  clientId: z.string().uuid().optional()
});

export const projetLinksDtoSchema = z.object({
  widget: z.string().url(),
  aides: z.string().url()
});
