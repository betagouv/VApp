import { Projet } from '../models/projet';
import { UsecaseInterface } from './usecase.interface';
import { ProjetRepositoryInterface } from '../repositories/projet.repository.interface';
import { RechercherAidesUsecase } from './rechercher-aides.usecase';

export class DemarrerProjetUsecase implements UsecaseInterface {
  constructor(
    public rechercherAidesUseCase: RechercherAidesUsecase,
    public projetRepository: ProjetRepositoryInterface
  ) {}

  public async execute(description: string = '') {
    const projet = Projet.create(description);
    const recommendations = await this.rechercherAidesUseCase.execute(projet);
    projet.recommendations = recommendations;

    await this.projetRepository.add(projet);

    return projet;
  }
}
