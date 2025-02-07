import { DemarrerProjetUsecase } from '@/application/usecases/demarrer-projet.usecase';
import { RechercherAidesScoresUsecase } from '@/application/usecases/rechercher-aides-scores.usecase';
import { PoserQuestionsUsecase } from '@/application/usecases/poser-questions.usecase';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { questionsGenerator } from '@/infra/ai/services/questions-generator';
import { atZoneGeographiqueRepository } from '@/infra/repositories/at-zone-geographique.repository';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { AideCompatibleAdapter } from '@/presentation/ui/adapters/aide-compatible.adapter';
import { CreerNouveauProjetUsecase } from '@/application/usecases/creer-nouveau-projet.usecase';
import { AideScoreRepository } from '@/infra/repositories/aide-score.repository';
import { aideScoringService } from '@/infra/ai/services/aide-scoring-service';
import { ProjetMapper } from '@/infra/mappers/projet.mapper';

export const aideCompatibleRepository = new AideScoreRepository(aideScoringService, aideRepository);

export const rechercherAidesScoresUsecase = new RechercherAidesScoresUsecase(aideCompatibleRepository);

export const demarrerProjetUsecase = new DemarrerProjetUsecase(projetRepository, atZoneGeographiqueRepository);

export const creerNouveauProjetUsecase = new CreerNouveauProjetUsecase(projetRepository, atZoneGeographiqueRepository);

export const poserQuestionUsecase = new PoserQuestionsUsecase(questionsGenerator);

export const aideCompatibleAdapter = new AideCompatibleAdapter(aideRepository);

export const projetMapper = new ProjetMapper(atZoneGeographiqueRepository);
