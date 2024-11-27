import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { AideRepositoryInterface } from '../repositories/aide.repository.interface';
import { NotationAideServiceInterface } from '../services/notation-aide.service.interface';
import { AideEligible } from '@/domain/models/aide-eligible';
import { Aide } from '@/domain/models/aide';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { msToMinutesAndSeconds } from '@/libs/utils/time';

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

    console.log('projet.criteresRechercheAide', projet.criteresRechercheAide);
    await this.notationAideService.initialize();
    const aides = await this.findAllFor(projet.criteresRechercheAide);
    const chunkedAides: Aide[][] = [];
    const chunkSize = 8;
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

  public async findAllFor(criteresRechercheAide: CriteresRechercheAide): Promise<Aide[]> {
    let sliceArgs: number[] = [];
    if (process.env.NB_AIDE_HARD_LIMIT) {
      console.log(`NB_AIDE_HARD_LIMIT a été fixé à ${process.env.NB_AIDE_HARD_LIMIT}.`);
      console.log(`La recherche ne sera lancée que sur ${process.env.NB_AIDE_HARD_LIMIT} aides max.`);
      sliceArgs = [0, Number(process.env.NB_AIDE_HARD_LIMIT)];
    }

    const filteredAides = await this.aideRepository.findAllFor(criteresRechercheAide);
    console.log(`Recherche parmis ${filteredAides.length} sur les ${await this.aideRepository.size()} au total.`);
    return filteredAides.slice(...sliceArgs);
  }
}
