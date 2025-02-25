import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { AtAidStep } from '@/infra/at/aid-step';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtAidDestination } from '@/infra/at/aid-destination';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';

export const nouveauProjetFormDtoSchema = zfd.formData({
  uuid: z.string().optional(),
  description: z.string().min(1, 'Vous devez décrire votre projet.'),
  porteur: z.nativeEnum(AtOrganizationTypeSlug),
  territoireId: z.string().min(1, 'Vous devez renseignez la zone géographique de votre projet.'),
  etatAvancement: z.nativeEnum(AtAidStep),

  payante: z.coerce.boolean().optional(),
  aideNatures: z.array(z.nativeEnum(AtAidTypeGroup)).optional().or(z.nativeEnum(AtAidTypeGroup)),
  actionsConcernees: z.array(z.nativeEnum(AtAidDestination)).optional().or(z.nativeEnum(AtAidDestination))
});

export type NouveauProjetFormDto = z.infer<typeof nouveauProjetFormDtoSchema>;
