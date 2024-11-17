import short, { SUUID } from 'short-uuid';
import { AideEligible } from '@/domain/models/aide-eligible';

export class Projet {
  constructor(
    public uuid: SUUID,
    public description: string = '',
    public aidesEligibles: AideEligible[] = [],
    public audience?: string
  ) {}

  public static create(description: string = '', aidesEligibles: AideEligible[] = [], audience?: string): Projet {
    return new Projet(short.generate(), description, aidesEligibles, audience);
  }

  public reformuler(description: Projet['description']) {
    this.description = description;
    this.aidesEligibles = [];
  }
}
