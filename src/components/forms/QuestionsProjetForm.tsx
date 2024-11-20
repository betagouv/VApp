'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { redirect } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Grid } from '@mui/material';
import { useActions, useUIState } from 'ai/rsc';
import { useLocalStorage } from 'usehooks-ts';

import { SubmitButton } from '@/components/forms/RechercherAidesForm';
import { GridItemLoader } from '@/components/GridItemLoader';
import { useMountEffect } from '@/presentation/hooks/useMountEffect';
import { repondreQuestionAction } from '@/actions/repondre-questions.action';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';
import type { QuestionsReponsesProvider, UIState } from '@/ai';

export const responseUpdater =
  (questionReponseIndex: number, reponse: string = '') =>
  (previousUiState: UIState) => ({
    ...previousUiState,
    questionsReponses: previousUiState.questionsReponses.with(questionReponseIndex, {
      ...previousUiState.questionsReponses[questionReponseIndex],
      reponse
    })
  });

export type QuestionsProjetFormState = {
  message: string;
  uuid?: string;
  questionsReponses?: QuestionReponse[];
};

const initialState: QuestionsProjetFormState = {
  message: '',
  uuid: undefined,
  questionsReponses: []
};

export interface QuestionsProjetFormProps {
  projetUuid: Projet['uuid'];
  aideUuid?: Aide['uuid'];
}

export function QuestionsProjetForm({ projetUuid }: QuestionsProjetFormProps) {
  // loading questions & reponses
  const [uiState, setUIState] = useUIState<typeof QuestionsReponsesProvider>();
  const { poserQuestionsAction } = useActions<typeof QuestionsReponsesProvider>();
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerAction() {
      const uiState = await poserQuestionsAction(projetUuid);
      if (!ignoreActionResult) {
        setUIState(() => uiState);
      }
    }

    triggerAction();

    return () => {
      ignoreActionResult = true;
    };
  });

  // form
  const [formState, formAction] = useFormState(repondreQuestionAction, initialState);
  const [, saveData] = useLocalStorage<QuestionReponse[]>(`questionsReponses[${projetUuid}]`, []);
  const form = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  useEffect(() => {
    if (formState?.uuid) {
      if (formState?.questionsReponses?.length === 3) {
        saveData(formState?.questionsReponses || []);
      } else {
        throw new Error('Impossible de retrouver les réponses aux questions.');
      }

      redirect(`/projets/${formState?.uuid}/preciser/reformulation`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {formState?.message && !pending && (
          <Alert severity={formState?.uuid ? 'success' : 'error'} title={formState?.message} />
        )}
      </Grid>
      <GridItemLoader loading={uiState.loading} />
      <Grid item xs={12}>
        <form action={formAction} ref={form}>
          <input type="hidden" name="projetId" value={projetUuid} />
          {uiState.questionsReponses.map(({ question, reponse }, i) => (
            <fieldset key={`question_${i}`}>
              <input type="hidden" name={`questionsReponses[${i}].question`} value={question} />
              <Input
                id={`reponse_${i}`}
                label={question}
                nativeTextAreaProps={{
                  name: `questionsReponses[${i}].reponse`,
                  value: reponse,
                  onChange: (event) => {
                    setUIState(responseUpdater(i, event.target.value));
                  }
                }}
                textArea
              />
            </fieldset>
          ))}
          <SubmitButton loading={uiState.loading}>Reformuler mon projet</SubmitButton>
        </form>
      </Grid>
    </Grid>
  );
}
