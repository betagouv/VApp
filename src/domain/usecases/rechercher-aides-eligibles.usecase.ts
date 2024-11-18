import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { AideRepositoryInterface } from '../repositories/aide.repository.interface';
import { AideEligible } from '@/domain/models/aide-eligible';
import { NotationAideServiceInterface } from '../services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';

function msToMinutesAndSeconds(ms: number) {
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(0);
  return `${m}m${s.padStart(2, '0')}s`;
}

export class RechercherAidesEligiblesUsecase implements UsecaseInterface {
  public constructor(
    private readonly notationAideService: NotationAideServiceInterface,
    private readonly aideRepository: AideRepositoryInterface,
    private readonly projetRepository: ProjetRepositoryInterface
  ) {}

  public async *execute(projet: Projet): AsyncGenerator<AideEligible> {
    if (!projet.description || projet.description.length === 0) {
      throw new Error('La description du projet est vide.');
    }

    await this.notationAideService.initialize();
    const aides = await this.findAllForAudience(projet.audience);
    const chunkedAides: Aide[][] = [];
    const chunkSize = 3;
    for (let i = 0; i < aides.length; i += chunkSize) {
      const chunk = aides.slice(i, i + chunkSize);
      chunkedAides.push(chunk);
    }

    performance.mark('notationStarted');
    const aidesNotees: AideEligible[] = [];
    for (let i = 0; i < chunkedAides.length; i++) {
      const chunkNotes = await Promise.all(
        chunkedAides[i].map((aide) => this.notationAideService.noterAide(aide, projet))
      );

      const chunkAidesNotees = chunkNotes.map((note, ni) => new AideEligible(note, chunkedAides[i][ni].uuid));
      yield* chunkAidesNotees;

      aidesNotees.push(...chunkAidesNotees);
    }
    performance.mark('notationFinished');
    performance.measure('notationDuration', 'notationStarted', 'notationFinished');
    console.log(
      `Le processus de notation a pris ${msToMinutesAndSeconds(performance.getEntriesByName('notationDuration')[0].duration)}`
    );

    projet.aidesEligibles = aidesNotees.sort(AideEligible.compare).slice(0, AideEligible.SELECTION);

    await this.projetRepository.save(projet);
  }

  public async findAllForAudience(audience?: string): Promise<Aide[]> {
    let sliceArgs: number[] = [];
    if (process.env.NB_AIDE_HARD_LIMIT) {
      console.log(`NB_AIDE_HARD_LIMIT a été fixé à ${process.env.NB_AIDE_HARD_LIMIT}.`);
      console.log(`La recherche ne sera lancée que sur ${process.env.NB_AIDE_HARD_LIMIT} aides max.`);
      sliceArgs = [0, Number(process.env.NB_AIDE_HARD_LIMIT)];
    }

    if (audience) {
      const filteredAides = await this.aideRepository.findAllForAudience(audience);
      console.log(`Recherche parmis ${filteredAides.length} sur les ${await this.aideRepository.size()} au total.`);
      const slicedFilteredAides = filteredAides.slice(...sliceArgs);
      return slicedFilteredAides;
    }

    return (await this.aideRepository.all()).slice(...sliceArgs);
  }
}
