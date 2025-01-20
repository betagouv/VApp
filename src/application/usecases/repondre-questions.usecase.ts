import { UsecaseInterface } from 'src/application/usecases/usecase.interface';
import { Projet } from 'src/domain/models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { RechercherAidesEligiblesService } from '@/domain/services/rechercher-aides-eligibles-service';

export class RepondreQuestionsUsecase implements UsecaseInterface {
  public constructor(
    public projetRepository: ProjetRepositoryInterface,
    public reformulationService: ReformulationServiceInterface,
    public rechercherAidesEligiblesService: RechercherAidesEligiblesService
  ) {}

  public async execute(projet: Projet, questionsReponses: QuestionReponse[]): Promise<Projet['description']> {
    // ⚠ mutation du projet
    await this.reformulationService.reformuler(projet, questionsReponses);
    await this.projetRepository.save(projet);
    const aidesEligibles = await this.rechercherAidesEligiblesService.rechercher(projet);
    projet.aidesEligibles = aidesEligibles;

    await this.projetRepository.save(projet);

    return projet.description;
  }
}
