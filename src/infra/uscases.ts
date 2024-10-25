import { DemarrerProjetUsecase } from '@/domain/usecases/demarrer-projet.usecase';
import { RechercherAidesUsecase } from '@/domain/usecases/rechercher-aides.usecase';
import { notationAideService } from '@/infra/ollama/notation-aide.service';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { PoserQuestionsUsecase } from '@/domain/usecases/poser-questions.usecase';
import { dummyQuestionsGenerator } from 'tests-vitest/infra/services/dummy-questions-generator';

export const demarrerProjetUsecase = new DemarrerProjetUsecase(
  new RechercherAidesUsecase(notationAideService, aideRepository),
  projetRepository
);

export const poserQuestionUsecase = new PoserQuestionsUsecase(dummyQuestionsGenerator);
