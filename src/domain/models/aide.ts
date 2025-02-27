import { AtAideTypeFull } from '@/infra/at/aid';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';
import { AideId, AideInterface } from '@/domain/models/aide.interface';
import { TokenRange } from '@/domain/models/token-range';
import { UnscorableAideError } from '@/domain/models/aide/unscorable-aide.error';

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
    return `https://aides-territoires.beta.gouv.fr${url}?utm_source=${process.env.NEXT_PUBLIC_APP_NAME}`;
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

  public isScorable(tokenRange: TokenRange): boolean {
    return Aide.isScorable(tokenRange)(this);
  }

  public static isScorable([min, max]: TokenRange) {
    return (aide: Aide) => aide.description.length > min && aide.description.length < max;
  }

  public assertScorable(tokenRange: TokenRange): void {
    if (!this.isScorable(tokenRange)) {
      throw new UnscorableAideError(
        `Impossible d'attribuer un score à cette aide, la longueur de sa description doit-être entre ${tokenRange.join('-')} alors qu'elle est de la longueur de la description est de ${this.description.length}.`
      );
    }
  }
}
