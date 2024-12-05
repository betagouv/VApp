export enum AtAidTypeGroup {
  'financial-group' = 'Aide financière',
  'technical-group' = 'Aide en ingénierie'
}

export type AtAidTypeGroupType = keyof typeof AtAidTypeGroup;

export const atAidTypeGroupOptions = Object.keys(AtAidTypeGroup).map((slug) => ({
  label: AtAidTypeGroup[slug as keyof typeof AtAidTypeGroup] as string,
  value: slug
}));
