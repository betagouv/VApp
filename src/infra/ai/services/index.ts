import { RechercherAidesEligiblesService } from '@/domain/services/rechercher-aides-eligibles-service';
import { notationAideService } from '@/infra/ai/services/notation-aide-service';
import { aideRepository } from '@/infra/repositories/aide.repository';

export const rechercherAidesEligiblesService = new RechercherAidesEligiblesService(notationAideService, aideRepository);
