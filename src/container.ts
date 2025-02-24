import { DemarrerProjetUsecase } from '@/application/usecases/demarrer-projet.usecase';
import { RechercherAidesScoresUsecase } from '@/application/usecases/rechercher-aides-scores.usecase';
import { PoserQuestionsUsecase } from '@/application/usecases/poser-questions.usecase';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { questionsGenerator } from '@/infra/ai/services/questions-generator';
import { atZoneGeographiqueRepository } from '@/infra/repositories/at-zone-geographique.repository';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { AideEvalueeAdapter } from '@/presentation/ui/adapters/aide-evaluee.adapter';
import { CreerNouveauProjetUsecase } from '@/application/usecases/creer-nouveau-projet.usecase';
import { AideScoreRepository } from '@/infra/repositories/aide-score.repository';
import { aideScoringService } from '@/infra/ai/services/aide-scoring-service';
import { ProjetMapper } from '@/infra/mappers/projet.mapper';
import { AidesScoringUsecase } from '@/application/usecases/aides-scoring.usecase';
import { getTokenRange } from '@/libs/env';

export const aideCompatibleRepository = new AideScoreRepository(aideScoringService, aideRepository);

export const rechercherAidesScoresUsecase = new RechercherAidesScoresUsecase(aideCompatibleRepository);

export const demarrerProjetUsecase = new DemarrerProjetUsecase(projetRepository, atZoneGeographiqueRepository);

export const creerNouveauProjetUsecase = new CreerNouveauProjetUsecase(projetRepository, atZoneGeographiqueRepository);

export const aidesScoringUsecase = new AidesScoringUsecase(projetRepository, aideScoringService, getTokenRange());

export const poserQuestionUsecase = new PoserQuestionsUsecase(questionsGenerator);

export const aideCompatibleAdapter = new AideEvalueeAdapter(aideRepository);

export const projetMapper = new ProjetMapper(atZoneGeographiqueRepository);
