import { UsecaseInterface } from './usecase.interface';
import { Aide } from '@/domain/models/aide';
import { Question } from '@/domain/models/question';
import { Projet } from '@/domain/models/projet';
import { QuestionsGeneratorInterface } from '@/domain/services/questions-generator.interface';

export class PoserQuestionsUsecase implements UsecaseInterface {
  public constructor(private readonly questionsGenerator: QuestionsGeneratorInterface) {}

  public async execute(projet: Projet, aide: Aide): Promise<Question[]> {
    await this.questionsGenerator.initialize();
    return await this.questionsGenerator.generateQuestions(projet, aide);
  }
}
