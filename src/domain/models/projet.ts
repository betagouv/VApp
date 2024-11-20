import short, { SUUID } from 'short-uuid';
import { AideEligible } from '@/domain/models/aide-eligible';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

export class Projet {
  constructor(
    public uuid: SUUID,
    public description: string = '',
    public aidesEligibles: AideEligible[] = [],
    public criteresRechercheAide: CriteresRechercheAide = {}
  ) {}

  public static create(
    description: string = '',
    aidesEligibles: AideEligible[] = [],
    criteresRechercheAide: CriteresRechercheAide = {}
  ): Projet {
    return new Projet(short.generate(), description, aidesEligibles, criteresRechercheAide);
  }

  public reformuler(description: Projet['description']) {
    this.description = description;
    this.aidesEligibles = [];
  }
}
