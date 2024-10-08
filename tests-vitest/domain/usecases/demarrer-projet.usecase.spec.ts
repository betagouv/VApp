import { it, expect } from 'vitest';
import { DemarrerProjetUsecase } from '../../../src/domain/usecases/demarrer-projet.usecase';

it('renders correctly', async () => {
  const demarrerProjet = new DemarrerProjetUsecase();
  const projet = await demarrerProjet.execute('Ammenager une piste cyclable');
  expect(projet).toMatchSnapshot({
    uuid: expect.any(String),
    description: 'Ammenager une piste cyclable'
  });
});
