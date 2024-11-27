import { ReactNode } from 'react';
import { createAI } from 'ai/rsc';

import { reformulerAction, poserQuestionsAction } from './actions';
import { QuestionReponse } from '@/domain/models/question-reponse';

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export interface UIState {
  questionsReponses: QuestionReponse[];
  loading: boolean;
  error?: boolean;
}

export interface AIState {
  questionsReponses: QuestionReponse[];
}

export const QuestionsReponsesProvider = createAI<
  AIState,
  UIState,
  {
    reformulerAction: typeof reformulerAction;
    poserQuestionsAction: typeof poserQuestionsAction;
  }
>({
  actions: {
    reformulerAction,
    poserQuestionsAction
  },
  initialAIState: {
    questionsReponses: []
  },
  initialUIState: {
    questionsReponses: [],
    loading: true
  }
});
