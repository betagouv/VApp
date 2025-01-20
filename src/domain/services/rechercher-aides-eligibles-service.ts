import { Projet } from '@/domain/models/projet';
import { AideEligible } from '@/domain/models/aide-eligible';
import { NotationAideServiceInterface } from '@/domain/services/notation-aide-service.interface';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { Aide } from '@/domain/models/aide';
import { msToMinutesAndSeconds } from '@/libs/utils/time';

export class RechercherAidesEligiblesService {
  public constructor(
    private readonly notationAideService: NotationAideServiceInterface,
    private readonly aideRepository: AideRepositoryInterface
  ) {}

  public async *rechercher(projet: Projet): AsyncGenerator<AideEligible> {
    if (!projet.description || projet.description.length === 0) {
      throw new Error('La description du projet est vide.');
    }

    console.log('projet.criteresRechercheAide', projet.criteresRechercheAide);

    const aides = await this.aideRepository.findAllFor(projet.criteresRechercheAide);
    const chunkedAides: Aide[][] = [];
    const chunkSize = 8;
    for (let i = 0; i < aides.length; i += chunkSize) {
      const chunk = aides.slice(i, i + chunkSize);
      chunkedAides.push(chunk);
    }

    await this.notationAideService.initialize();
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

    return aidesNotees.sort(AideEligible.compare).slice(0, AideEligible.SELECTION);
  }
}
