import { z } from 'zod';
import { AideEvalueeInterface } from '@/domain/models/aide/aide-evaluee.interface';
import { AtAidType } from '@/infra/at/aid-type';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';

export const aideDtoSchema = z.object({
  id: z.string().describe('Identifiant unique de l’aide (ex: "162955")'),
  atId: z.number().describe('Identifiant Aide Territoires'),
  scoreCompatibilite: z.number().int().min(0).max(100).describe('Score de compatibilité interne, sur 100'),
  conditionEligibilite: z.string().describe('Moteur de règle ou condition d’éligibilité textuelle'),

  // Détails (basé sur le schema aide normalisé data.gouv)
  nom: z.string().describe('Nom ou titre de l’aide ex: "Développer des projets pédagogiques..."'),
  description: z.string().describe('Description de l’aide (e.g. "La Manche étant une terre de cheval historique...")'),
  urlDescriptif: z.string().url().describe('Lien vers la page descriptive de l’aide'),
  contact: z.string().describe('Contact pour candidater ou obtenir des infos (email, tél, etc.)'),
  programmes: z.array(z.string()).describe('Programmes concernés ex: ["France Relance", "FSE"]'),

  // Plan de Financement
  typesAides: z.array(z.nativeEnum(AtAidType)).describe('Liste des types d’aides ex: ["Subvention", "Autre"]'),
  typesAidesGroupes: z.array(z.nativeEnum(AtAidTypeGroup)).describe('Regroupement des types d’aides ex: ["Financiere"]')

  // dateOuverture: z.date().describe('Date d’ouverture ex: "2025-06-01"'),
  // datePreDepot: z.date().describe('Date limite pour pré-dépôt ex: "2024-12-01"'),
  // dateCloture: z.date().describe('Date de clôture ex: "2025-05-31"')
});

aideDtoSchema._output satisfies AideEvalueeInterface;

export type AideDto = z.infer<typeof aideDtoSchema>;
