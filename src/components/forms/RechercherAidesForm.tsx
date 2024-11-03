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
import targetedAudiences from 'data/targeted-audiences.json';
import Select from '@codegouvfr/react-dsfr/SelectNext';

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
  const [formState, formAction] = useFormState(demarrerProjetAction, initialState);
  const { pending } = useFormStatus();
  useEffect(() => {
    if (formState?.uuid) {
      redirect(`/projets/${formState?.uuid}`);
    }
  }, [formState]);

  return (
    <form action={formAction}>
      {pending && <CircularProgress />}
      {formState?.message && !pending && (
        <Alert severity={formState?.uuid ? 'success' : 'error'} title={formState?.message} />
      )}
      <Input
        label="Description du projet"
        textArea
        id="description"
        hintText="Plus la description de votre projet sera précise, plus notre IA sera en mesure de vous proposer des aides adaptées à celui-ci."
        nativeTextAreaProps={{
          name: 'description'
        }}
      />
      <Select
        label="Type de structure"
        options={targetedAudiences.map((audience: string) => ({ label: audience, value: audience }))}
      />
      <SubmitButton />
    </form>
  );
}
