import short, { SUUID } from 'short-uuid';
import { AideEligible } from '@/domain/models/aide-eligible';

export class Projet {
  public uuid: SUUID;
  public description: string;
  public aidesEligibles: AideEligible[] = [];

  constructor(uuid: SUUID, description: string = '', aidesEligibles: AideEligible[] = []) {
    this.uuid = uuid;
    this.description = description;
    this.aidesEligibles = aidesEligibles;
  }

  public static create(description: string = '', aidesEligibles: AideEligible[] = []): Projet {
    return new Projet(short.generate(), description, aidesEligibles);
  }

  public reformuler(description: Projet['description']) {
    this.description = description;
  }
}
