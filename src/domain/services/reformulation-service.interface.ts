import { Projet } from '../models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';

export interface ReformulationServiceInterface {
  initialize(): Promise<void>;
  reformuler(projet: Projet, questionsReponses: QuestionReponse[]): Promise<Projet>;
}
