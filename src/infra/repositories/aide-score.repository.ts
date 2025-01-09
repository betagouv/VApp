import * as console from 'node:console';
import { performance } from 'next/dist/compiled/@edge-runtime/primitives';
import { msToMinutesAndSeconds } from '@/libs/time';
import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { AideScoringServiceInterface } from '@/domain/services/aide-scoring-service.interface';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { AideScoreRepositoryInterface } from '@/domain/repositories/aide-score-repository.interface';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

export class AideScoreRepository implements AideScoreRepositoryInterface {
  public constructor(
    private readonly scoringAideService: AideScoringServiceInterface,
    private readonly aideRepository: AideRepositoryInterface
  ) {}

  public async *findAllAsyncForProjet(
    projet: Projet,
    criteres: CriteresRechercheAide,
    chunkSize = 8
  ): AsyncGenerator<AideScore> {
    const aides = await this.aideRepository.findAllForProjet(projet, criteres);

    await this.scoringAideService.initialize();
    performance.mark('scoringStarted');

    const aidesScores: AideScore[] = [];
    for (let i = 0; i < aides.length; i += chunkSize) {
      const chunkAidesScores = await this.scoringAideService.aidesScores(aides.slice(i, i + chunkSize), projet);
      aidesScores.push(...chunkAidesScores);
      yield* chunkAidesScores;
    }
    performance.mark('scoringFinished');
    performance.measure('scoringDuration', 'scoringStarted', 'scoringFinished');
    console.log(
      `Le processus de scoring a pris ${msToMinutesAndSeconds(performance.getEntriesByName('scoringDuration')[0].duration)}`
    );

    return aidesScores.sort(AideScore.compare).slice(0, AideScore.SELECTION);
  }
}
