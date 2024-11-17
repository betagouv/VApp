import { it, describe, expect } from 'vitest';
import { RechercherAidesEligiblesUsecase } from '@/domain/usecases/rechercher-aides-eligibles.usecase';
import { Projet } from '@/domain/models/projet';
import { dummyAideRepository } from '../../infra/repository/dummy-aide.repository';
import { randomNotationAideService } from '../../infra/services/random-notation-aide.service';
import { dummyProjetRepository } from '../../infra/repository/dummy-projet.repository';

describe('poser questions usecase', () => {
  it('returns a list of suggestions', async () => {
    const projet = Projet.create('Restaurer une zone humide');
    const suggererAides = new RechercherAidesEligiblesUsecase(
      randomNotationAideService,
      dummyAideRepository,
      dummyProjetRepository
    );
    const response = await suggererAides.execute(projet);
    for await (const part of response) {
      expect(part).toMatchSnapshot({
        eligibilite: expect.any(Number),
        aideId: expect.any(String)
      });
    }
  });
});
