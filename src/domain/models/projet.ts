import short, { SUUID, UUID } from 'short-uuid';
import { AideScore } from '@/domain/models/aide-score';
import { Porteur } from '@/domain/models/projet/porteur';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { AideScoreMap } from '@/domain/models/aide-score.map';

const translator = short();

export class Projet {
  constructor(
    public suuid: SUUID,
    public description: string,
    public porteur: Porteur,
    public etatAvancement: LesCommunsProjetStatuts = LesCommunsProjetStatuts.IDEE,
    public zonesGeographiques: ZoneGeographique[] = [],
    public aidesScores: AideScoreMap = new Map(),
    public clientId?: UUID
  ) {}

  public static create(
    description: string,
    porteur: Porteur,
    etatAvancement: LesCommunsProjetStatuts = LesCommunsProjetStatuts.IDEE,
    zonesGeographiques: ZoneGeographique[] = [],
    aidesScores: AideScoreMap = new Map(),
    clientId?: UUID
  ): Projet {
    if (!description || description.length === 0) {
      throw new Error('La description du projet est vide.');
    }

    return new Projet(
      short.generate(),
      description,
      porteur,
      etatAvancement,
      zonesGeographiques,
      aidesScores,
      clientId
    );
  }

  public get uuid(): UUID {
    return translator.toUUID(this.suuid);
  }

  public reformuler(description: Projet['description']) {
    this.description = description;
    this.aidesScores = new Map();
  }

  public updateScores(scores: AideScore[]): void {
    scores.forEach((score) => {
      this.aidesScores.set(score.aideId, score);
    });
  }

  public addScore(score: AideScore): void {
    this.aidesScores.set(score.aideId, score);
  }

  public getSortedAideScores() {
    return Array.from(this.aidesScores, ([, aideScore]) => aideScore).sort(AideScore.compare);
  }
}
