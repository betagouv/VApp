import { AideEvalueeInterface } from '@/domain/models/aide/aide-evaluee.interface';
import { AtAidType } from '@/infra/at/aid-type';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { Aide } from '@/domain/models/aide';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';

export class AideEvaluee implements AideEvalueeInterface {
  constructor(
    public id: string,
    public scoreCompatibilite: number,
    public conditionEligibilite: string,

    // Détails
    public nom: string,
    public description: string,

    public contact: string,
    // public porteur: Porteur,
    public typesAides: AtAidType[],
    public typesAidesGroupes: AtAidTypeGroup[],
    public programmes: string[],

    // Plan de financement
    public projetEtatAvancement: string[],
    public programmeAides: string[],
    // public dateOuverture: Date,
    // public datePreDepot: Date

    public urlDescriptif?: string,
    public fournisseurDonnees?: FournisseurDonneesAides
  ) {}

  static fromAideAndScore(aide: Aide, scoreCompatibilite: number): AideEvaluee {
    return new AideEvaluee(
      aide.id,
      scoreCompatibilite,
      '',
      aide.nom,
      aide.description,
      '',
      [],
      [],
      [],
      [],
      [],
      aide.getUrl(),
      aide.fournisseurDonnees
    );
  }
}
