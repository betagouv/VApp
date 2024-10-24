import { it } from 'vitest';
import { DemarrerProjetUsecase } from '@/domain/usecases/demarrer-projet.usecase';
import { RechercherAidesUsecase } from '@/domain/usecases/rechercher-aides.usecase';
import { Projet } from '@/domain/models/projet';
import { randomNotationAideService } from '../../infra/services/random-notation-aide.service';
import { dummyAideRepository } from '../../infra/repository/dummy-aide.repository';
import { dummyProjetRepository } from '../../infra/repository/dummy-projet.repository';

it('renders correctly', async () => {
  const demarrerProjetUsecase = new DemarrerProjetUsecase(
    new RechercherAidesUsecase(randomNotationAideService, dummyAideRepository),
    dummyProjetRepository
  );
  await demarrerProjetUsecase.execute(Projet.create('Ammenager une piste cyclable'));
});
