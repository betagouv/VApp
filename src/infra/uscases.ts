import { DemarrerProjetUsecase } from '@/domain/usecases/demarrer-projet.usecase';
import { RechercherAidesEligiblesUsecase } from '@/domain/usecases/rechercher-aides-eligibles.usecase';
import { PoserQuestionsUsecase } from '@/domain/usecases/poser-questions.usecase';
import { RepondreQuestionsUsecase } from '@/domain/usecases/repondre-questions.usecase';
// import { notationAideService } from '@/infra/ollama/notation-aide.service';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { dummyQuestionsGenerator } from 'tests-vitest/infra/services/dummy-questions-generator';
import { dummyReformulationService } from 'tests-vitest/infra/services/dummy-reformulation-service';
import { randomNotationAideService } from 'tests-vitest/infra/services/random-notation-aide.service';

export const demarrerProjetUsecase = new DemarrerProjetUsecase(
  new RechercherAidesEligiblesUsecase(randomNotationAideService, aideRepository),
  projetRepository
);

export const poserQuestionUsecase = new PoserQuestionsUsecase(dummyQuestionsGenerator);

export const repondreQuestionsUsecase = new RepondreQuestionsUsecase(projetRepository, dummyReformulationService);
