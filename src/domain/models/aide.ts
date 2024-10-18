import short, { SUUID } from 'short-uuid';

export class Aide {
  public uuid: SUUID;
  public nom: string;
  public description?: string;

  constructor(uuid: SUUID, nom: string, description?: string) {
    this.uuid = uuid;
    this.nom = nom;
    this.description = description;
  }

  public static create(nom: string, description = '') {
    return new Aide(short.generate(), nom, description);
  }
}
