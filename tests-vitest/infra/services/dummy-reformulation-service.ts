import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { Projet } from '@/domain/models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';

export class DummyReformulationService implements ReformulationServiceInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public reformuler(projet: Projet, questionsReponses: QuestionReponse[]) {
    projet.description = projet.description.concat(`
Lorem ipsum dolor sit amet.`);

    return Promise.resolve(projet);
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }
}

export const dummyReformulationService = new DummyReformulationService();
