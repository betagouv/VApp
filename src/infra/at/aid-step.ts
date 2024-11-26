export enum AtAidStep {
  preop = 'Réflexion / conception',
  op = 'Mise en œuvre / réalisation',
  postop = 'Usage / valorisation'
}

export const atAidStepOptions = Object.keys(AtAidStep).map((slug) => ({
  label: AtAidStep[slug as keyof typeof AtAidStep] as string,
  value: slug
}));
