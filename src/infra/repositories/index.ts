import { AideScoreRepository } from '@/infra/repositories/aide-score.repository';
import { aideScoringService } from '@/infra/ai/services/aide-scoring-service';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { AideEvalueeRepository } from '@/infra/repositories/aide-evaluee.repository';

export const aideScoreRepository = new AideScoreRepository(aideScoringService, aideRepository);
export const aideEvalueeRepository = new AideEvalueeRepository(aideScoringService, aideRepository);
