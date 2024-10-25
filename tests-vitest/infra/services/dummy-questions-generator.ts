import { QuestionsGeneratorInterface } from '@/domain/services/questions-generator.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { Question } from '@/domain/models/question';

export class DummyQuestionsGenerator implements QuestionsGeneratorInterface {
  generateQuestions(projet: Projet, aide: Aide): Promise<Question[]> {
    return Promise.resolve([
      "Quelle est la superficie et l'état actuel de la zone humide que tu souhaites restaurer ? Est-elle encore fonctionnelle ou très dégradée ?",
      "Quels sont les objectifs principaux de la restauration ? Par exemple, est-ce pour préserver la biodiversité, améliorer la qualité de l'eau, ou créer une zone pédagogique ?",
      "Quels moyens et ressources (matériaux, main-d'œuvre, financement) as-tu envisagés pour la restauration, et disposes-tu d'un soutien technique ou scientifique ?"
    ]);
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }
}

export const dummyQuestionsGenerator = new DummyQuestionsGenerator();
