import { AtAideTypeFull } from '@/infra/at/aid';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';
import { AideId, AideInterface } from '@/domain/models/aide.interface';

export class Aide implements AideInterface {
  constructor(
    public id: AideId,
    public nom: string,
    public description: string,
    public types: AtAideTypeFull[],
    public programmes: string[],
    public url?: string,
    public fournisseurDonnees?: FournisseurDonneesAides
  ) {
    if (id && !fournisseurDonnees) {
      console.warn(`L'aide "${nom}" possède un externalId mais n'a pas identifié le fournisseur de données.`);
    }

    this.nom = nom;
    this.description = description;
    this.fournisseurDonnees = fournisseurDonnees;
    this.url = url;
    this.types = types;
    this.programmes = programmes;
  }

  public static getAidesTerritoiresUrl({ url }: Pick<Aide, 'url'>) {
    return `https://aides-territoires.beta.gouv.fr${url}`;
  }

  public getUrl() {
    if (this.fournisseurDonnees === FournisseurDonneesAides.AideTerritoires) {
      return Aide.getAidesTerritoiresUrl(this);
    }
    return;
  }

  public static getId({ id }: Aide) {
    return id;
  }

  public isScorable(min: number, max: number): boolean {
    return this.description.length > min && this.description.length < max;
  }
}
