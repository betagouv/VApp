import { DemarrerProjetUsecase } from '@/application/usecases/demarrer-projet.usecase';
import { RechercherAidesEligiblesUsecase } from '@/application/usecases/rechercher-aides-eligibles.usecase';
import { PoserQuestionsUsecase } from '@/application/usecases/poser-questions.usecase';
import { RepondreQuestionsUsecase } from '@/application/usecases/repondre-questions.usecase';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { questionsGenerator } from '@/infra/ai/services/questions-generator';
import { reformulationService } from '@/infra/ai/services/reformulation-service';
import { rechercherAidesEligiblesService } from '@/infra/ai/services';

export const rechercherAidesEligiblesUsecase = new RechercherAidesEligiblesUsecase(rechercherAidesEligiblesService);

export const demarrerProjetUsecase = new DemarrerProjetUsecase(projetRepository);

export const poserQuestionUsecase = new PoserQuestionsUsecase(questionsGenerator);

export const repondreQuestionsUsecase = new RepondreQuestionsUsecase(
  projetRepository,
  reformulationService,
  rechercherAidesEligiblesService
);
