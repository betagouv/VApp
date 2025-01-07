export enum AtOrganizationType {
  Association = 'association',
  Commune = 'commune',
  Recherche = 'researcher',
  Agriculteur = 'farmer',
  CSP = 'special',
  EPCI = 'epci',
  EPA = 'public-cies',
  Departement = 'department',
  EPL = 'public-org',
  Privee = 'private-sector',
  Region = 'region',
  Particulier = 'private-person'
}

export const atOrganizationTypeLabels: Record<AtOrganizationType, string> = {
  [AtOrganizationType.Association]: 'Association',
  [AtOrganizationType.Commune]: 'Commune',
  [AtOrganizationType.Recherche]: 'Recherche',
  [AtOrganizationType.Agriculteur]: 'Agriculteur',
  [AtOrganizationType.CSP]: 'Collectivité d’outre-mer à statut particulier',
  [AtOrganizationType.EPCI]: 'Intercommunalité / Pays',
  [AtOrganizationType.EPA]: "Etablissement public dont services de l'Etat",
  [AtOrganizationType.Departement]: 'Département',
  [AtOrganizationType.EPL]: 'Entreprise publique locale (Sem, Spl, SemOp)',
  [AtOrganizationType.Privee]: 'Entreprise privée',
  [AtOrganizationType.Region]: 'Région',
  [AtOrganizationType.Particulier]: 'Particulier'
} as const;
