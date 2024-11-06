'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { LoadingMessage, SubmitButton } from '@/components/forms/RechercherAidesForm';
import { repondreQuestionAction } from '@/actions/repondre-questions.action';
import { Question } from '@/domain/models/question';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';

const initialState = {
  message: '',
  uuid: undefined
};

export interface QuestionsProjetPourAideFormProps {
  questions: Question[];
  projetUuid: Projet['uuid'];
  aideUuid?: Aide['uuid'];
}

export function QuestionsProjetPourAideForm({ questions, projetUuid }: QuestionsProjetPourAideFormProps) {
  const [formState, formAction] = useFormState(repondreQuestionAction, initialState);
  const { pending } = useFormStatus();
  useEffect(() => {
    if (formState?.uuid) {
      redirect(`/projets/${formState?.uuid}?tab=description`);
    }
  }, [formState]);

  return (
    <form action={formAction}>
      <LoadingMessage />
      {formState?.message && !pending && (
        <Alert severity={formState?.uuid ? 'success' : 'error'} title={formState?.message} />
      )}
      <input type="hidden" name="projetId" value={projetUuid} />
      {questions.map((question, i) => (
        <fieldset key={`question_${i}`}>
          <input type="hidden" name={`questionsReponses[${i}].question`} value={question} />
          <Input
            id={`reponse_${i}`}
            label={question}
            nativeTextAreaProps={{ name: `questionsReponses[${i}].reponse` }}
            textArea
          />
        </fieldset>
      ))}
      <SubmitButton>Réévaluer l'égibilité aux aides</SubmitButton>
    </form>
  );
}
