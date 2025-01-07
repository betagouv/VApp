export type AideTypeGroupe = 'ingenierie' | 'financiere';

export const AideFinanciere = {
  Subvention: 'subvention',
  Pret: 'pret',
  AvanceRecuperable: 'avance-recuperable',
  Autre: 'autre-aide-financiere',
  CEE: 'certificat-economie-energie'
} as const;

export type AideFinanciere = (typeof AideFinanciere)[keyof typeof AideFinanciere];

export const AideIngenierie = {
  Technique: 'technique',
  Financiere: 'financiere',
  Juridique: 'juridique'
} as const;

export type AideIngenierie = (typeof AideIngenierie)[keyof typeof AideIngenierie];

export const AideType = { ...AideFinanciere, AideIngenierie } as const;

export type AideType = (typeof AideType)[keyof typeof AideType];
