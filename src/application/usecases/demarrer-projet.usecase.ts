import { Projet } from 'src/domain/models/projet';
import { UsecaseInterface } from 'src/application/usecases/usecase.interface';
import { ProjetRepositoryInterface } from 'src/domain/repositories/projet.repository.interface';

export class DemarrerProjetUsecase implements UsecaseInterface {
  constructor(public projetRepository: ProjetRepositoryInterface) {}

  public async execute(projet: Projet): Promise<void> {
    await this.projetRepository.add(projet);
  }
}
