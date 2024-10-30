import { it, describe, expect } from 'vitest';
import { PoserQuestionsUsecase } from '@/domain/usecases/poser-questions.usecase';
import { Projet } from '@/domain/models/projet';
import { dummyAideRepository } from '../../infra/repository/dummy-aide.repository';
import { dummyQuestionsGenerator } from '../../infra/services/dummy-questions-generator';

describe('poser questions usecase', () => {
  it('returns a list of questions', async () => {
    const projet = Projet.create('');
    const poserQuestionsUsecase = new PoserQuestionsUsecase(dummyQuestionsGenerator);
    const questions = await poserQuestionsUsecase.execute(projet, (await dummyAideRepository.all()).slice(0, 3));
    questions.forEach((question) => expect(question).not.to.be.empty);
  });
});
