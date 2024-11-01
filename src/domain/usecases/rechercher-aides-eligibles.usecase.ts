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
    const sliceArgs = process.env.NODE_ENV == 'development' ? [0, 15] : [];
    const aides = (await this.aideRepository.all()).slice(...sliceArgs);
    const notes = [];
    for (let i = 0; i < aides.length; i++) {
      const note = await this.notationAideService.noterAide(aides[i], projet);
      notes.push(note);
    }

    return notes
      .map((note, i) => new AideEligible(note, aides[i].uuid))
      .sort((a, b) => b.eligibilite - a.eligibilite)
      .slice(0, 10);
  }
}
