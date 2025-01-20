import { z } from 'zod';
import { AtAidStep } from '@/infra/at/aid-step';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtAidDestination } from '@/infra/at/aid-destination';
import { AtOrganizationType } from '@/infra/at/organization-type';
import { zfd } from 'zod-form-data';

export const nouveauProjetFormDtoSchema = zfd.formData({
  description: z.string().min(1, 'Vous devez décrire votre projet.'),
  uuid: z.string().optional(),
  audience: z.nativeEnum(AtOrganizationType).optional(),
  commune: z.string().optional(),
  territoireId: z.string().optional(),
  payante: z.string().optional(),
  etatsAvancements: z.array(z.nativeEnum(AtAidStep)).optional().or(z.nativeEnum(AtAidStep)),
  aideNatures: z.array(z.nativeEnum(AtAidTypeGroup)).optional().or(z.nativeEnum(AtAidTypeGroup)),
  actionsConcernees: z.array(z.nativeEnum(AtAidDestination)).optional().or(z.nativeEnum(AtAidDestination))
});

export type NouveauProjetFormDto = z.infer<typeof nouveauProjetFormDtoSchema>;
