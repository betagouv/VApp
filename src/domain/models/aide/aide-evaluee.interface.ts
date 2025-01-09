import { AtAidType } from '@/infra/at/aid-type';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';

export interface Porteur {
  nom: string;
  siren: string;
}

export interface AideEvalueeInterface {
  id: string;
  atId: number;
  scoreCompatibilite: number;
  conditionEligibilite: string;

  // Détails (basé sur le schema aide normalisé data.gouv)
  nom: string;
  description: string;
  urlDescriptif: string;
  contact: string;
  // porteur: Porteur;
  typesAides: AtAidType[];
  typesAidesGroupes: AtAidTypeGroup[];
  programmes: string[];

  // Plan de Financement
  // dateOuverture: Date;
  // datePreDepot: Date;
}
