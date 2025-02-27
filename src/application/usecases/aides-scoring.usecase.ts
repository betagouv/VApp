import { UUID } from 'short-uuid';
import { AideScoringService } from '@/infra/ai/services/aide-scoring-service';
import { UsecaseInterface } from '@/application/usecases/usecase.interface';
import { ProjetIntrouvableError } from '@/application/errors/projet-introuvable.error';
import { UnauthorizedError } from '@/application/errors/unauthorized.error';
import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { Aide } from '@/domain/models/aide';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { TokenRange } from '@/domain/models/token-range';

export type AidesScoringUsecaseInput = {
  projetId: Projet['uuid'];
  aides: Aide[];
  clientId: UUID;
};

export class AidesScoringUsecase implements UsecaseInterface {
  public constructor(
    private readonly projetRepository: ProjetRepositoryInterface,
    private readonly aideScoringService: AideScoringService,
    private readonly tokenRange: TokenRange
  ) {}

  public async execute({ projetId, aides, clientId }: AidesScoringUsecaseInput): Promise<AideScore[]> {
    const projet = await this.projetRepository.findOneById(projetId);

    if (!projet) {
      throw new ProjetIntrouvableError(`Aucun projet trouvé pour l'identifiant ${projetId}.`);
    }

    if (projet.clientId && projet.clientId !== clientId) {
      throw new UnauthorizedError(`Vous n'êtes pas autorisé a accéder au projet ${projetId}.`);
    }

    const scorableAides = aides.filter(Aide.isScorable(this.tokenRange));
    for (const scorableAide of scorableAides) {
      const aideScore = await this.aideScoringService.aideScore(scorableAide, projet);
      projet.addScore(aideScore);
    }

    await this.projetRepository.save(projet);

    return projet.getSortedAideScores();
  }
}
