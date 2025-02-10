'use server';

import { getMutableAIState } from 'ai/rsc';

import { Projet } from '@/domain/models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { poserQuestionUsecase } from '@/container';
import { AIState, QuestionsReponsesProvider } from '@/presentation/ui/ai';

export async function poserQuestionsAction(projetId: Projet['suuid']) {
  const projet = await projetRepository.fromSuuid(projetId);
  const aides = await Promise.all(projet.getSortedAideScores().map(({ aideId }) => aideRepository.fromId(aideId)));

  const mutableAIState = getMutableAIState<typeof QuestionsReponsesProvider>();

  try {
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
  } catch (error) {
    console.error(error);
    return {
      questionsReponses: [],
      loading: false,
      error: true
    };
  }
}
