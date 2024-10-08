import { UsecaseInterface } from './usecase.interface';
import { ProjetEntity } from '../entities/projet.entity';
import { AideRepositoryInterface } from '../repositories/aide.repository.interface';
import { Suggestion } from '../value-objects/suggestion';
import { NotationAideServiceInterface } from '../services/notation-aide.service.interface';

export class SuggererAidesUseCase implements UsecaseInterface {
  public constructor(
    private readonly notationAideService: NotationAideServiceInterface,
    private readonly aideRepository: AideRepositoryInterface
  ) {}

  public async execute(projet: ProjetEntity) {
    if (!projet.description || projet.description.length === 0) {
      throw new Error('La description du projet est vide.');
    }

    const aides = await this.aideRepository.getAll();
    const notes = await Promise.all(aides.map((aide) => this.notationAideService.noterAide(aide, projet)));

    return notes.map((note, i) => new Suggestion(note, aides[i].uuid)).sort((a, b) => b.note - a.note);
  }
}
