export class Aide {
  constructor(
    public uuid: string,
    public atId: number,
    public nom: string,
    public description: string,
    public url: string
  ) {}

  public static getAidesTerritoiresUrl({ url }: Pick<Aide, 'url'>) {
    return `https://aides-territoires.beta.gouv.fr${url}`;
  }

  public getAidesTerritoiresUrl() {
    return Aide.getAidesTerritoiresUrl(this);
  }

  public static getId({ uuid }: Aide) {
    return uuid;
  }
}
