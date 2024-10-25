import { Projet } from '../models/projet';
import { Aide } from '@/domain/models/aide';
import { QuestionReponse } from '@/domain/models/question-reponse';

export interface ReformulationServiceInterface {
  initialize(): Promise<void>;
  reformuler(projet: Projet, aide: Aide, questionsReponses: QuestionReponse[]): Promise<Projet>;
}
