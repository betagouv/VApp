export enum AtAidStep {
  Reflexion = 'preop',
  Realisation = 'op',
  Usage = 'postop'
}

export const atAidStepLabels: Record<AtAidStep, string> = {
  [AtAidStep.Reflexion]: 'Réflexion / conception',
  [AtAidStep.Realisation]: 'Mise en œuvre / réalisation',
  [AtAidStep.Usage]: 'Usage / valorisation'
} as const;
