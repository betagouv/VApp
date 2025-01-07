export enum AtAidDestination {
  Fonctionnement = 'supply',
  Investissement = 'investment'
}

export const atAidDestinationLabels: Record<AtAidDestination, string> = {
  [AtAidDestination.Fonctionnement]: 'Dépenses de fonctionnement',
  [AtAidDestination.Investissement]: 'Dépenses d’investissement'
} as const;
