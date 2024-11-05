'use client';

import * as React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { repondreQuestionAction } from '@/actions/repondre-questions.action';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { Loader } from '@/components/Loader';
import { Question } from '@/domain/models/question';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';

const initialState = {
  message: '',
  uuid: undefined
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" onClick={function noRefCheck() {}} aria-disabled={pending} disabled={pending}>
      Réévaluer l'égibilité aux aides
    </Button>
  );
}

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
      {pending && <Loader />}
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
      <SubmitButton />
    </form>
  );
}
