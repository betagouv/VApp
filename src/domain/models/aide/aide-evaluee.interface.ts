import { AtAidType } from '@/infra/at/aid-type';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';

export interface Porteur {
  nom: string;
  siren: string;
}

export interface AideEvalueeInterface {
  id: string;
  fournisseurDonnees?: FournisseurDonneesAides;
  scoreCompatibilite: number;
  conditionEligibilite: string;

  // Détails (basé sur le schema aide normalisé data.gouv)
  nom: string;
  description: string;
  urlDescriptif?: string;
  contact: string;
  // porteur: Porteur;
  typesAides: AtAidType[];
  typesAidesGroupes: AtAidTypeGroup[];
  programmes: string[];

  // Plan de Financement
  // dateOuverture: Date;
  // datePreDepot: Date;
}
