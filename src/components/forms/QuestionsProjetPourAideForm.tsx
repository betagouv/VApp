'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { demarrerProjetAction } from '@/actions/demarrer-projet.action';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { CircularProgress } from '@mui/material';
import { Loader } from '@/components/Loader';
import { Question } from '@/domain/models/question';
import { repondreQuestionAction } from '@/actions/repondre-questions.action';

const initialState = {
  message: '',
  uuid: undefined
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" onClick={function noRefCheck() {}} aria-disabled={pending} disabled={pending}>
      Rechercher des aides
    </Button>
  );
}
export interface QuestionsProjetPourAideFormProps {
  questions: Question[];
}

export function QuestionsProjetPourAideForm({ questions }: QuestionsProjetPourAideFormProps) {
  const [formState, formAction] = useFormState(repondreQuestionAction, initialState);
  const { pending } = useFormStatus();
  useEffect(() => {
    if (formState?.uuid) {
      redirect(`/projets/${formState?.uuid}`);
    }
  }, [formState]);

  return (
    <form action={formAction}>
      {pending && <Loader />}
      {formState?.message && !pending && (
        <Alert severity={formState?.uuid ? 'success' : 'error'} title={formState?.message} />
      )}
      {questions.map((question, i) => (
        <Input
          key={`question_${i}`}
          label={question}
          textArea
          id={`question_${i}`}
          nativeTextAreaProps={{
            name: `question_${i}`
          }}
        />
      ))}

      <SubmitButton />
    </form>
  );
}
