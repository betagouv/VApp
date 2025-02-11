import short, { SUUID, UUID } from 'short-uuid';
import { AideScore } from '@/domain/models/aide-score';
import { Porteur } from '@/domain/models/projet/porteur';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { AideScoreMap } from '@/domain/models/aide-score.map';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

const translator = short();

export class Projet {
  public criteresRechercheAide: CriteresRechercheAide = {};

  constructor(
    public uuid: UUID,
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
    clientId?: UUID,
    uuid?: UUID
  ): Projet {
    if (!description || description.length === 0) {
      throw new Error('La description du projet est vide.');
    }

    return new Projet(
      uuid || translator.uuid(),
      description,
      porteur,
      etatAvancement,
      zonesGeographiques,
      aidesScores,
      clientId
    );
  }

  public get suuid(): SUUID {
    return translator.fromUUID(this.uuid);
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
