import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { AideRepositoryInterface } from '../repositories/aide.repository.interface';
import { Recommendation } from '../models/recommendation';
import { NotationAideServiceInterface } from '../services/notation-aide.service.interface';

export class RechercherAidesUsecase implements UsecaseInterface {
  public constructor(
    private readonly notationAideService: NotationAideServiceInterface,
    private readonly aideRepository: AideRepositoryInterface
  ) {}

  public async execute(projet: Projet): Promise<Recommendation[]> {
    if (!projet.description || projet.description.length === 0) {
      throw new Error('La description du projet est vide.');
    }

    await this.notationAideService.initialize();
    const aides = await this.aideRepository.all();
    const notes = await Promise.all(aides.slice(0, 3).map((aide) => this.notationAideService.noterAide(aide, projet)));

    return notes
      .map((note, i) => new Recommendation(note, aides[i].uuid))
      .sort((a, b) => b.eligibilite - a.eligibilite);
  }
}
