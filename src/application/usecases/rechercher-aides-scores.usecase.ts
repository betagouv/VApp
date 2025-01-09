import { UsecaseInterface } from '@/application/usecases/usecase.interface';
import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { AideScoreRepositoryInterface } from '@/domain/repositories/aide-score-repository.interface';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

export class RechercherAidesScoresUsecase implements UsecaseInterface {
  public constructor(private readonly aideCompatibleRepository: AideScoreRepositoryInterface) {}

  public async *execute(projet: Projet, criteres?: CriteresRechercheAide): AsyncGenerator<AideScore> {
    yield* this.aideCompatibleRepository.findAllAsyncForProjet(projet, criteres);
  }
}
