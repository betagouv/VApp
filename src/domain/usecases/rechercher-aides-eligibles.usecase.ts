import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { AideRepositoryInterface } from '../repositories/aide.repository.interface';
import { AideEligible } from '@/domain/models/aide-eligible';
import { NotationAideServiceInterface } from '../services/notation-aide.service.interface';

export class RechercherAidesEligiblesUsecase implements UsecaseInterface {
  public constructor(
    private readonly notationAideService: NotationAideServiceInterface,
    private readonly aideRepository: AideRepositoryInterface
  ) {}

  public async execute(projet: Projet): Promise<AideEligible[]> {
    if (!projet.description || projet.description.length === 0) {
      throw new Error('La description du projet est vide.');
    }

    await this.notationAideService.initialize();
    const aides = await this.aideRepository.all();
    const notes = await Promise.all(aides.map((aide) => this.notationAideService.noterAide(aide, projet)));

    return (
      notes
        .filter((note) => !!note)
        // @ts-expect-error empty notes are filtered
        .map((note, i) => new AideEligible(note, aides[i].uuid))
        .sort((a, b) => b.eligibilite - a.eligibilite)
        .slice(0, 3)
    );
  }
}
