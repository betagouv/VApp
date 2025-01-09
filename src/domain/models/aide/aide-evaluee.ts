import { UUID } from 'short-uuid';
import { AideEvalueeInterface } from '@/domain/models/aide/aide-evaluee.interface';
import { AtAidType } from '@/infra/at/aid-type';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { Aide } from '@/domain/models/aide';

export class AideEvaluee implements AideEvalueeInterface {
  constructor(
    public id: UUID,
    public atId: number,
    public scoreCompatibilite: number,
    public conditionEligibilite: string,

    // Détails
    public nom: string,
    public description: string,
    public urlDescriptif: string,
    public contact: string,
    // public porteur: Porteur,
    public typesAides: AtAidType[],
    public typesAidesGroupes: AtAidTypeGroup[],
    public programmes: string[],

    // Plan de financement
    public projetEtatAvancement: string[],
    public programmeAides: string[]
    // public dateOuverture: Date,
    // public datePreDepot: Date
  ) {}

  static fromAideAndScore(aide: Aide, scoreCompatibilite: number): AideEvaluee {
    return new AideEvaluee(
      aide.uuid,
      aide.atId,
      scoreCompatibilite,
      '',
      aide.nom,
      aide.description,
      aide.getAidesTerritoiresUrl(),
      '',
      [],
      [],
      [],
      [],
      []
    );
  }
}
