import { it, describe, expect } from 'vitest';
import { SuggererAidesUseCase } from '../../../src/domain/usecases/suggerer-aides.usecase';
import { dummyAideRepository } from '../../infra/repository/dummy-aide.repository';
import { randomNotationAideService } from '../../infra/services/random-notation-aide.service';
import { ProjetEntity } from '../../../src/domain/entities/projet.entity';

describe('suggerer aide usecase', () => {
  it('throws when the project description is empty', async () => {
    const projet = ProjetEntity.create('');
    const suggererAides = new SuggererAidesUseCase(randomNotationAideService, dummyAideRepository);
    await expect(suggererAides.execute(projet)).rejects.toThrowError(/description/);
  });

  it('returns a list of suggestions', async () => {
    const projet = ProjetEntity.create('Restaurer une zone humide');
    const suggererAides = new SuggererAidesUseCase(randomNotationAideService, dummyAideRepository);
    const suggestions = await suggererAides.execute(projet);
    suggestions.forEach((suggestion) =>
      expect(suggestion).toMatchSnapshot({
        note: expect.any(Number),
        aideId: expect.any(String)
      })
    );
  });
});
