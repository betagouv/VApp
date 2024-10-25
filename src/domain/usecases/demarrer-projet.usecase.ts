import { Projet } from '../models/projet';
import { UsecaseInterface } from './usecase.interface';
import { ProjetRepositoryInterface } from '../repositories/projet.repository.interface';
import { RechercherAidesEligiblesUsecase } from 'src/domain/usecases/rechercher-aides-eligibles.usecase';

export class DemarrerProjetUsecase implements UsecaseInterface {
  constructor(
    public rechercherAidesEligiblesUsecase: RechercherAidesEligiblesUsecase,
    public projetRepository: ProjetRepositoryInterface
  ) {}

  public async execute(projet: Projet): Promise<void> {
    projet.aidesEligibles = await this.rechercherAidesEligiblesUsecase.execute(projet);

    await this.projetRepository.add(projet);
  }
}
