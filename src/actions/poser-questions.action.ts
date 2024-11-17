'use server';

import { getMutableAIState } from 'ai/rsc';

import { Projet } from '@/domain/models/projet';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { poserQuestionUsecase } from '@/infra/uscases';
import { AIState, QuestionsReponsesProvider } from '@/ai';
import { QuestionReponse } from '@/domain/models/question-reponse';

export async function poserQuestionsAction(projetUuid: Projet['uuid']) {
  const projet = await projetRepository.fromUuid(projetUuid);
  const aides = await Promise.all(projet.aidesEligibles.map(({ aideId }) => aideRepository.fromUuid(aideId)));

  const mutableAIState = getMutableAIState<typeof QuestionsReponsesProvider>();

  const questions = await poserQuestionUsecase.execute(projet, aides.slice(0, 3));
  const questionsReponses: QuestionReponse[] = questions.map((question) => ({ question, reponse: '' }));

  // @ts-expect-error lib typing is wrong
  mutableAIState.done((aiState: AIState) => ({
    ...aiState,
    questionsReponses
  }));

  return {
    questionsReponses,
    loading: false
  };
}
