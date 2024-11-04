import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { AideRepositoryInterface } from '../repositories/aide.repository.interface';
import { AideEligible } from '@/domain/models/aide-eligible';
import { NotationAideServiceInterface } from '../services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';

function msToMinutesAndSeconds(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = Number(((ms % 60000) / 1000).toFixed(0));
  return m + ':' + (s < 10 ? '0' : '') + s;
}

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
    const aides = await this.findAllForAudience(projet.audience);
    const chunkedAides = [];
    const chunkSize = 4;
    for (let i = 0; i < aides.length; i += chunkSize) {
      const chunk = aides.slice(i, i + chunkSize);
      chunkedAides.push(chunk);
    }

    performance.mark('notationStarted');
    const notes: number[] = [];
    for (let i = 0; i < chunkedAides.length; i++) {
      const chunkNotes = await Promise.all(
        chunkedAides[i].map((aide) => this.notationAideService.noterAide(aide, projet))
      );
      notes.push(...chunkNotes);
    }
    performance.mark('notationFinished');
    performance.measure('notationDuration', 'notationStarted', 'notationFinished');
    console.log(
      `Le processus de notation a pris ${msToMinutesAndSeconds(performance.getEntriesByName('notationDuration')[0].duration)}`
    );

    return notes
      .map((note, i) => new AideEligible(note, aides[i].uuid))
      .sort((a, b) => b.eligibilite - a.eligibilite)
      .slice(0, 10);
  }

  public async findAllForAudience(audience?: string): Promise<Aide[]> {
    const sliceArgs = process.env.NODE_ENV == 'development' ? [0, 100] : [];
    if (audience) {
      const filteredAides = await this.aideRepository.findAllForAudience(audience);
      console.log(`Recherche parmis ${filteredAides.length} sur les ${await this.aideRepository.size()} au total.`);
      const slicedFilteredAides = filteredAides.slice(...sliceArgs);
      console.log(`(En dev la recherche est en réalité faite sur ${slicedFilteredAides.length} aides seulement)`);

      return slicedFilteredAides;
    }

    return (await this.aideRepository.all()).slice(...sliceArgs);
  }
}
