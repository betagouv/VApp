import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { Aide } from '@/domain/models/aide';
import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { ProjetRepository } from '@/infra/repositories/projet.repository';

export class RepondreQuestionsUsecase implements UsecaseInterface {
  public constructor(
    public projetRepository: ProjetRepository,
    public reformulationService: ReformulationServiceInterface
  ) {}

  public async execute(
    projet: Projet,
    aide: Aide,
    questionsReponses: QuestionReponse[]
  ): Promise<Projet['description']> {
    // ⚠ mutation du projet
    await this.reformulationService.reformuler(projet, aide, questionsReponses);
    await this.projetRepository.update(projet);

    return projet.description;
  }
}
