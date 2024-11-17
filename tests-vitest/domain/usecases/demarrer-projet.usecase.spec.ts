import { it } from 'vitest';
import { DemarrerProjetUsecase } from '@/domain/usecases/demarrer-projet.usecase';
import { Projet } from '@/domain/models/projet';
import { dummyProjetRepository } from '../../infra/repository/dummy-projet.repository';

it('renders correctly', async () => {
  const demarrerProjetUsecase = new DemarrerProjetUsecase(dummyProjetRepository);
  await demarrerProjetUsecase.execute(Projet.create('Ammenager une piste cyclable'));
});
