import { it, describe, expect } from 'vitest';
import { RechercherAidesUsecase } from '@/domain/usecases/rechercher-aides.usecase';
import { Projet } from '@/domain/models/projet';
import { dummyAideRepository } from '../../infra/repository/dummy-aide.repository';
import { randomNotationAideService } from '../../infra/services/random-notation-aide.service';

describe('suggerer aide usecase', () => {
  it('throws when the project description is empty', async () => {
    const projet = Projet.create('');
    const suggererAides = new RechercherAidesUsecase(randomNotationAideService, dummyAideRepository);
    await expect(suggererAides.execute(projet)).rejects.toThrowError(/description/);
  });

  it('returns a list of suggestions', async () => {
    const projet = Projet.create('Restaurer une zone humide');
    const suggererAides = new RechercherAidesUsecase(randomNotationAideService, dummyAideRepository);
    const suggestions = await suggererAides.execute(projet);
    suggestions.forEach((suggestion) =>
      expect(suggestion).toMatchSnapshot({
        eligibilite: expect.any(Number),
        aideId: expect.any(String)
      })
    );
  });
});
