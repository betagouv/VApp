import short, { SUUID } from 'short-uuid';

export class ProjetEntity {
  public uuid: SUUID;
  public description: string;

  constructor(uuid: SUUID, description: string = '') {
    this.uuid = uuid;
    this.description = description;
  }

  public static create(description: string = ''): ProjetEntity {
    return new ProjetEntity(short.generate(), description);
  }
}
