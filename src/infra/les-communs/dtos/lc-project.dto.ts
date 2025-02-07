import { z } from '@/libs/validation';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';

export const lcProjectDtoSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(), // ISO date string
  updatedAt: z.string().datetime(), // ISO date string
  nom: z.string(),
  description: z.string(),
  // porteurCodeSiret: z.string(),
  // porteurReferentEmail: z.string().email(),
  // porteurReferentTelephone: z.string(),
  // porteurReferentPrenom: z.string(),
  // porteurReferentNom: z.string(),
  // porteurReferentFonction: z.string(),
  // budget: z.number(),
  // forecastedStartDate: z.string().datetime(), // ISO date string
  status: z.nativeEnum(LesCommunsProjetStatuts).optional(),
  communes: z.array(
    z.object({
      inseeCode: z.string()
    })
  )
  // competences: z.array(z.string())
  // leviers: z.array(z.string()),
  // externalId: z.string()
  // mecId: z.string().optional(), // Identifiant dans le service MEC
  // tetId: z.string().optional(), // Identifiant dans le service TeT
  // recocoId: z.string().optional() // Identifiant dans le service Recoco
});

export type LcProjectDto = z.infer<typeof lcProjectDtoSchema>;
