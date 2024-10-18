import { it } from 'vitest';
import { DemarrerProjetUsecase } from '../../../src/domain/usecases/demarrer-projet.usecase';
import { projetRepository } from '../../../src/infra/repositories/projet.repository';
import { RechercherAidesUsecase } from '../../../src/domain/usecases/rechercher-aides.usecase';
import { randomNotationAideService } from '../../infra/services/random-notation-aide.service';
import { dummyAideRepository } from '../../infra/repository/dummy-aide.repository';

it('renders correctly', async () => {
  const demarrerProjetUsecase = new DemarrerProjetUsecase(
    new RechercherAidesUsecase(randomNotationAideService, dummyAideRepository),
    projetRepository
  );
  await demarrerProjetUsecase.execute('Ammenager une piste cyclable');
});
