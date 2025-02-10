import { AtAideTypeFull } from '@/infra/at/aid';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';

export type AideId = string;

export interface AideInterface {
  id: AideId;
  nom: string;
  description: string;
  url?: string;
  types: AtAideTypeFull[];
  programmes: string[];
  fournisseurDonnees?: FournisseurDonneesAides;
}
