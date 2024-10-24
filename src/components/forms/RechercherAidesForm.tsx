'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { demarrerProjet } from '@/actions/demarrerProjet';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';

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

export function RechercherAidesForm() {
  const [formState, formAction] = useFormState(demarrerProjet, initialState);
  useEffect(() => {
    if (formState?.uuid) {
      redirect(`/projets/${formState?.uuid}`);
    }
  }, [formState]);

  return (
    <form action={formAction}>
      {formState?.message && <Alert severity={formState?.uuid ? 'success' : 'error'} title={formState?.message} />}
      <Input
        label="Description"
        textArea
        id="description"
        hintText="hint text"
        nativeTextAreaProps={{
          name: 'description'
        }}
      />
      <SubmitButton />
    </form>
  );
}
