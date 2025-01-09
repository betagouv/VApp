import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { AtAidStep } from '@/infra/at/aid-step';

export class EtatAvancementMapper {
  static fromLesCommunsToAt(projetStatus?: LesCommunsProjetStatuts): AtAidStep {
    switch (projetStatus) {
      case LesCommunsProjetStatuts.EN_COURS:
        return AtAidStep.Usage;
      case LesCommunsProjetStatuts.FAISABILITE:
        return AtAidStep.Realisation;
      case LesCommunsProjetStatuts.ABANDONNE:
      case LesCommunsProjetStatuts.TERMINE:
      case LesCommunsProjetStatuts.IDEE:
      case LesCommunsProjetStatuts.IMPACTE:
      default:
        return AtAidStep.Reflexion;
    }
  }

  static fromAtToLesCommuns(aidStep?: AtAidStep): LesCommunsProjetStatuts {
    switch (aidStep) {
      case AtAidStep.Usage:
      case AtAidStep.Realisation:
        return LesCommunsProjetStatuts.EN_COURS;
      case AtAidStep.Reflexion:
      default:
        return LesCommunsProjetStatuts.IDEE;
    }
  }
}
