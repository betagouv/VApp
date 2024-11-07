'use client';

import * as React from 'react';
import { PropsWithChildren, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { redirect } from 'next/navigation';
import { CircularProgress, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Button } from '@codegouvfr/react-dsfr/Button';
import { demarrerProjetAction } from '@/actions/demarrer-projet.action';
import targetedAudiences from 'data/targeted-audiences.json';

const initialState = {
  message: '',
  uuid: undefined
};

export function SubmitButton({ children }: PropsWithChildren) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" onClick={function noRefCheck() {}} aria-disabled={pending} disabled={pending}>
      {children}
      {'\u00A0'}
      {pending ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
    </Button>
  );
}

export function LoadingMessage() {
  const { pending } = useFormStatus();

  if (pending) {
    return <Alert severity="info" title="Veuillez patienter, la recherche peut prendre quelques minutes..." />;
  }

  return null;
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LoadingMessage />
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
            nativeSelectProps={{
              name: 'audience'
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <SubmitButton>Rechercher des aides</SubmitButton>
        </Grid>
      </Grid>
    </form>
  );
}
