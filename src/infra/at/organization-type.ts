export enum AtOrganizationType {
  'association' = 'Association',
  'commune' = 'Commune',
  'researcher' = 'Recherche',
  'farmer' = 'Agriculteur',
  'special' = 'Collectivité d’outre-mer à statut particulier',
  'epci' = 'Intercommunalité / Pays',
  'public-cies' = "Etablissement public dont services de l'Etat",
  'department' = 'Département',
  'public-org' = 'Entreprise publique locale (Sem, Spl, SemOp)',
  'private-sector' = 'Entreprise privée',
  'region' = 'Région',
  'private-person' = 'Particulier'
}

export type AtOrganisationTypeKey = keyof typeof AtOrganizationType;
