import { describe, expect, it } from 'vitest';
import { dummyAideRepository } from '../../infra/repository/dummy-aide.repository';
import { dummyQuestionsGenerator } from '../../infra/services/dummy-questions-generator';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { PoserQuestionsUsecase } from '@/application/usecases/poser-questions.usecase';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { Projet } from '@/domain/models/projet';

describe('poser questions usecase', () => {
  it('returns a list of questions', async () => {
    const projet = Projet.create('Lorem Ipsum', AtOrganizationTypeSlug.Commune, LesCommunsProjetStatuts.IDEE);
    const poserQuestionsUsecase = new PoserQuestionsUsecase(dummyQuestionsGenerator);
    const questions = await poserQuestionsUsecase.execute(projet, (await dummyAideRepository.all()).slice(0, 3));
    questions.forEach((question) => expect(question).not.to.be.empty);
  });
});
