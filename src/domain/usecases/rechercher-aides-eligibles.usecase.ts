import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { AideRepositoryInterface } from '../repositories/aide.repository.interface';
import { AideEligible } from '@/domain/models/aide-eligible';
import { NotationAideServiceInterface } from '../services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';

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
    const aides = await this.findAllForAudience();
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

  public async findAllForAudience(audience?: string): Promise<Aide[]> {
    const sliceArgs = process.env.NODE_ENV == 'development' ? [0, 15] : [];
    if (audience) {
      return (await this.aideRepository.findAllForAudience(audience)).slice(...sliceArgs);
    }

    return (await this.aideRepository.all()).slice(...sliceArgs);
  }
}
