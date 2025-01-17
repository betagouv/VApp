import { DemarrerProjetUsecase } from '@/domain/usecases/demarrer-projet.usecase';
import { RechercherAidesEligiblesUsecase } from '@/domain/usecases/rechercher-aides-eligibles.usecase';
import { PoserQuestionsUsecase } from '@/domain/usecases/poser-questions.usecase';
import { RepondreQuestionsUsecase } from '@/domain/usecases/repondre-questions.usecase';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { notationAideService } from '@/infra/ai/services/notation-aide-service';
import { questionsGenerator } from '@/infra/ai/services/questions-generator';
import { reformulationService } from '@/infra/ai/services/reformulation-service';

export const rechercherAidesEligiblesUsecase = new RechercherAidesEligiblesUsecase(
  notationAideService,
  aideRepository,
  projetRepository
);

export const demarrerProjetUsecase = new DemarrerProjetUsecase(projetRepository);

export const poserQuestionUsecase = new PoserQuestionsUsecase(questionsGenerator);

export const repondreQuestionsUsecase = new RepondreQuestionsUsecase(
  projetRepository,
  reformulationService,
  rechercherAidesEligiblesUsecase
);
