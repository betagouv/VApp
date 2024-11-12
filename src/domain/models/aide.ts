import short, { SUUID } from 'short-uuid';

export class Aide {
  constructor(
    public uuid: SUUID,
    public nom: string,
    public description: string,
    public url: string
  ) {}

  public getAidesTerritoiresUrl() {
    return `https://aides-territoires.beta.gouv.fr${this.url}`;
  }

  public static getId({ uuid }: Aide) {
    return uuid;
  }

  public static createUuid() {
    return short.generate();
  }
}
