import { assertValid } from '@/domain/note';

export class AideEligible {
  static SELECTION = 10;

  constructor(
    public eligibilite: number,
    public aideId: string
  ) {
    assertValid(eligibilite);

    this.eligibilite = eligibilite;
    this.aideId = aideId;
  }

  static compare(a: Pick<AideEligible, 'eligibilite'>, b: Pick<AideEligible, 'eligibilite'>) {
    return b.eligibilite - a.eligibilite;
  }
}
