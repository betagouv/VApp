export enum AtOrganizationTypeSlug {
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

export const atOrganizationTypeLabels: Record<AtOrganizationTypeSlug, string> = {
  [AtOrganizationTypeSlug.Association]: 'Association',
  [AtOrganizationTypeSlug.Commune]: 'Commune',
  [AtOrganizationTypeSlug.Recherche]: 'Recherche',
  [AtOrganizationTypeSlug.Agriculteur]: 'Agriculteur',
  [AtOrganizationTypeSlug.CSP]: 'Collectivité d’outre-mer à statut particulier',
  [AtOrganizationTypeSlug.EPCI]: 'Intercommunalité / Pays',
  [AtOrganizationTypeSlug.EPA]: "Etablissement public dont services de l'Etat",
  [AtOrganizationTypeSlug.Departement]: 'Département',
  [AtOrganizationTypeSlug.EPL]: 'Entreprise publique locale (Sem, Spl, SemOp)',
  [AtOrganizationTypeSlug.Privee]: 'Entreprise privée',
  [AtOrganizationTypeSlug.Region]: 'Région',
  [AtOrganizationTypeSlug.Particulier]: 'Particulier'
} as const;
