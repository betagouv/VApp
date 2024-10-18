import short, { SUUID } from 'short-uuid';
import { Recommendation } from './recommendation';

export class Projet {
  public uuid: SUUID;
  public description: string;
  public recommendations: Recommendation[] = [];

  constructor(uuid: SUUID, description: string = '', recommendations: Recommendation[] = []) {
    this.uuid = uuid;
    this.description = description;
    this.recommendations = recommendations;
  }

  public static create(description: string = '', recommendations: Recommendation[] = []): Projet {
    return new Projet(short.generate(), description, recommendations);
  }
}
