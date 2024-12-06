export enum AtAidType {
  // Financial
  'grant' = 'Subvention',
  'loan' = 'Prêt',
  'recoverable-advance' = 'Avance récupérable',
  'other' = 'Autre aide financière',
  'cee' = "Certificat d'économie d'énergie (CEE)",
  // Technical
  'technical-engineering' = 'Ingénierie technique',
  'financial-engineering' = 'Ingénierie financière',
  'legal-engineering' = 'Ingénierie Juridique / administrative'
}

export type AtAidTypeSlug = keyof typeof AtAidType;

export const atAidTypeToOptions = (slug: string) => ({
  label: AtAidType[slug as AtAidTypeSlug] as string,
  value: slug
});

export const atAidTypeFinancialSlugs: AtAidTypeSlug[] = ['grant', 'loan', 'recoverable-advance', 'other', 'cee'];

export const atAidTypeTechnialSlugs: AtAidTypeSlug[] = [
  'technical-engineering',
  'financial-engineering',
  'legal-engineering'
];
