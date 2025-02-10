import { UsecaseInterface } from '@/application/usecases/usecase.interface';
import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { AideScoringService } from '@/infra/ai/services/aide-scoring-service';
import { Aide } from '@/domain/models/aide';
import { UUID } from 'short-uuid';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { ProjetIntrouvableError } from '@/application/errors/projet-introuvable.error';
import { UnauthorizedError } from '@/application/errors/unauthorized.error';

export type AidesScoringUsecaseInput = {
  projetId: Projet['uuid'];
  aides: Aide[];
  clientId: UUID;
};

export class AidesScoringUsecase implements UsecaseInterface {
  public constructor(
    private readonly projetRepository: ProjetRepositoryInterface,
    private readonly aideScoringService: AideScoringService
  ) {}

  public async execute({ projetId, aides, clientId }: AidesScoringUsecaseInput): Promise<AideScore[]> {
    const projet = await this.projetRepository.findOneById(projetId);

    if (!projet) {
      throw new ProjetIntrouvableError(`Aucun projet trouvé pour l'identifiant ${projetId}.`);
    }

    console.log(projet.clientId);
    console.log(clientId);
    if (projet.clientId && projet.clientId !== clientId) {
      throw new UnauthorizedError(`Vous n'êtes pas autorisé a accéder au projet ${projetId}.`);
    }

    return this.aideScoringService.aidesScores(aides, projet);
  }
}
