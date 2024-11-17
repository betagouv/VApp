import { GenerateResponse } from 'ollama';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { AbortableAsyncIterator } from '@/libs/utils/types';
import { Projet } from '../models/projet';

export interface ReformulationServiceInterface {
  initialize(): Promise<void>;
  reformuler(projet: Projet, questionsReponses: QuestionReponse[]): Promise<AbortableAsyncIterator<GenerateResponse>>; // @todo remove domain pollution
}
