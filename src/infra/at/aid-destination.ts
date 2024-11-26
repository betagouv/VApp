export enum AtAidDestination {
  supply = 'Dépenses de fonctionnement',
  investment = 'Dépenses d’investissement'
}

export const atAidDestinationOptions = Object.keys(AtAidDestination).map((slug) => ({
  label: AtAidDestination[slug as keyof typeof AtAidDestination] as string,
  value: slug
}));
