import { z } from '@/libs/validation';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';
import { AideInterface } from '@/domain/models/aide.interface';
import { getNbTokenRange } from '@/infra/repositories/at-aide-repository';

export const requiredScoringFieldsDtoSchema = z.object({
  id: z.string().min(1).openapi({
    example: 'd7b9efbf-2181-42e2-966c-a65527c14ee7',
    description:
      "Identifiant unique de l’aide dans votre système. **Si il s'agit d'un entier, vous devrez le convertir en chaîne de caractères.**"
  }),
  nom: z.string().openapi({
    example: 'Financer un projet favorable à la cohésion sociale avec le prêt social',
    description: 'Nom ou titre de l’aide'
  }),
  description: z.string().openapi({
    example:
      "Pleinement engagées à créer du lien entre les citoyens, la mixité sociale et de l'inclusion, les collectivités locales renforcent leurs actions par un financement dédié, le prêt social...",
    description: `La description de l'aide (au format **markdown** de préférence). Pour obtenir un **score de compatibilité fiable** la description doit-être comprise entre ${getNbTokenRange().join(' et ')} caractères.`
  }),
  fournisseurDonnees: z.nativeEnum(FournisseurDonneesAides).optional().openapi({
    example: FournisseurDonneesAides.AideTerritoires,
    description: "Si vous êtes identifié comme un fournisseur de données d'aides."
  })
});

export type RequiredScoringFieldsDto = z.infer<typeof requiredScoringFieldsDtoSchema>;

requiredScoringFieldsDtoSchema._output satisfies Pick<
  AideInterface,
  'id' | 'description' | 'nom' | 'fournisseurDonnees'
>;

export const aidesScoringRequestDtoSchema = z.object({
  data: z.array(requiredScoringFieldsDtoSchema)
});
