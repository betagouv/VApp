import { UUID } from 'short-uuid';

export class AideScore {
  static SELECTION = 30;
  static MIN = 0;
  static MAX = 100;

  constructor(
    public scoreCompatibilite: number,
    public aideId: UUID
  ) {
    AideScore.assertValid(scoreCompatibilite);

    this.scoreCompatibilite = scoreCompatibilite;
    this.aideId = aideId;
  }

  static compare(a: Pick<AideScore, 'scoreCompatibilite'>, b: Pick<AideScore, 'scoreCompatibilite'>) {
    return b.scoreCompatibilite - a.scoreCompatibilite;
  }

  static toPercent(score: number) {
    return (score - AideScore.MIN) / (AideScore.MAX - AideScore.MIN);
  }

  static fromUnitInterval(unitInterval: number) {
    return unitInterval * (AideScore.MAX - AideScore.MIN) + AideScore.MIN;
  }

  static format(score: number) {
    return `${Math.floor(AideScore.toPercent(score) * 100)}%`;
  }

  static isScore<T>(input: T | false | undefined | null | ''): input is T {
    if (input === 0) {
      return true;
    }

    return !!input;
  }

  static assertValid(score: number | null, customMessage?: string) {
    console.assert(
      AideScore.isScore(score) && score >= AideScore.MIN && score <= AideScore.MAX,
      customMessage || `${score} n'est pas un score valide.`
    );
  }
}
