import { UsecaseInterface } from './usecase.interface';
import { Projet } from '../models/projet';
import { AideEligible } from '@/domain/models/aide-eligible';
import { RechercherAidesEligiblesService } from '@/domain/services/rechercher-aides-eligibles-service';

export class RechercherAidesEligiblesUsecase implements UsecaseInterface {
  public constructor(private readonly rechercherAidesEligiblesService: RechercherAidesEligiblesService) {}

  public async *execute(projet: Projet): AsyncGenerator<AideEligible> {
    return this.rechercherAidesEligiblesService.rechercher(projet);
  }
}
