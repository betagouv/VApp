import { assertValid } from '@/domain/note';

export class AideEligible {
  constructor(
    public eligibilite: number,
    public aideId: string
  ) {
    assertValid(eligibilite);

    this.eligibilite = eligibilite;
    this.aideId = aideId;
  }
}
