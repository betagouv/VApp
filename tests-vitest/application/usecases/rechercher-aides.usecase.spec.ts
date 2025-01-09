import { describe, expect, it } from 'vitest';
import { dummyAideCompatibleRepository } from '../../infra/repository/dummy-aide-compatible.repository';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { RechercherAidesScoresUsecase } from '@/application/usecases/rechercher-aides-scores.usecase';
import { Projet } from '@/domain/models/projet';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';

describe('poser questions usecase', () => {
  it('returns a list of suggestions', async () => {
    const projet = Projet.create(
      'Restaurer une zone humide',
      AtOrganizationTypeSlug.Commune,
      LesCommunsProjetStatuts.IDEE,
      []
    );
    const suggererAides = new RechercherAidesScoresUsecase(dummyAideCompatibleRepository);
    const response = await suggererAides.execute(projet);
    for await (const part of response) {
      expect(part).toMatchSnapshot({
        scoreCompatibilite: expect.any(Number),
        aideId: expect.any(String)
      });
    }
  });
});
