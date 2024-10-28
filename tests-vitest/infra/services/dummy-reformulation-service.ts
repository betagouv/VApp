import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';

export class DummyReformulationService implements ReformulationServiceInterface {
  public reformuler(projet: Projet, aide: Aide, questionsReponses: QuestionReponse[]) {
    projet.description = projet.description.concat(`
Lorem ipsum dolor sit amet.`);

    return Promise.resolve(projet);
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }
}

export const dummyReformulationService = new DummyReformulationService();
