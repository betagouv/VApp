export enum AtAidTypeGroup {
  Financiere = 'financial-group',
  Ingenierie = 'technical-group'
}

export const atAidTypeGroupLabels: Record<AtAidTypeGroup, string> = {
  [AtAidTypeGroup.Financiere]: 'Aide financière',
  [AtAidTypeGroup.Ingenierie]: 'Aide en ingénierie'
} as const;
