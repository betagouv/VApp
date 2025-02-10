export enum FournisseurDonneesAides {
  AideTerritoires = 'aides-territoires'
}

export const fournisseurDonneesAidesLabels: Record<FournisseurDonneesAides, string> = {
  [FournisseurDonneesAides.AideTerritoires]: 'Aides Territoires'
} as const;
