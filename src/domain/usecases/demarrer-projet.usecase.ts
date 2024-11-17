import { Projet } from '../models/projet';
import { UsecaseInterface } from './usecase.interface';
import { ProjetRepositoryInterface } from '../repositories/projet.repository.interface';

export class DemarrerProjetUsecase implements UsecaseInterface {
  constructor(public projetRepository: ProjetRepositoryInterface) {}

  public async execute(projet: Projet): Promise<void> {
    await this.projetRepository.add(projet);
  }
}
