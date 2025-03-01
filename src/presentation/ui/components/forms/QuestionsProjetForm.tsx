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

import { SubmitButton } from '@/presentation/ui/components/SubmitButton';
import { GridItemLoader } from '@/presentation/ui/components/GridItemLoader';
import { useMountEffect } from '@/presentation/ui/hooks/useMountEffect';
import { repondreQuestionAction } from '@/presentation/ui/actions/repondre-questions.action';
import type { QuestionsReponsesProvider, UIState } from '@/presentation/ui/ai';

import { Projet } from '@/domain/models/projet';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { AideId } from '@/domain/models/aide.interface';

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
  suuid?: string;
  questionsReponses?: QuestionReponse[];
};

const initialState: QuestionsProjetFormState = {
  message: '',
  suuid: undefined,
  questionsReponses: []
};

export interface QuestionsProjetFormProps {
  projetSuuid: Projet['suuid'];
  aideId?: AideId;
}

export function QuestionsProjetForm({ projetSuuid }: QuestionsProjetFormProps) {
  // loading questions & reponses
  const [uiState, setUIState] = useUIState<typeof QuestionsReponsesProvider>();
  const { poserQuestionsAction } = useActions<typeof QuestionsReponsesProvider>();
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerAction() {
      const uiState = await poserQuestionsAction(projetSuuid);
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
  const [, saveData] = useLocalStorage<QuestionReponse[]>(`questionsReponses[${projetSuuid}]`, []);
  const form = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  useEffect(() => {
    if (formState?.suuid) {
      if (formState?.questionsReponses?.length === 3) {
        saveData(formState?.questionsReponses || []);
      } else {
        throw new Error('Impossible de retrouver les réponses aux questions.');
      }

      redirect(`/projets/${formState?.suuid}/preciser/reformulation`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {formState?.message && !pending && (
          <Alert severity={formState?.suuid ? 'success' : 'error'} title={formState?.message} />
        )}

        {uiState.error && (
          <Alert
            severity="error"
            title="Une erreur est survenue lors de la génération des questions. Veuillez recharger la page."
          />
        )}
      </Grid>
      <GridItemLoader loading={uiState.loading} />
      <Grid item xs={12}>
        <form action={formAction} ref={form}>
          <input type="hidden" name="projetId" value={projetSuuid} />
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
          <SubmitButton loading={uiState.loading} error={uiState.error}>
            Reformuler mon projet
          </SubmitButton>
        </form>
      </Grid>
    </Grid>
  );
}
