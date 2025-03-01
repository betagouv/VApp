import { Projet } from '@/domain/models/projet';
import { Aide } from '@/domain/models/aide';
import { Question } from '@/domain/models/question';

export interface QuestionsGeneratorInterface {
  generateQuestions(projet: Projet, aides: Aide[]): Promise<Question[]>;
  initialize(): Promise<void>;
}
