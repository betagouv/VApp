'use client';

import * as React from 'react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { redirect } from 'next/navigation';
import { SUUID } from 'short-uuid';
import { CircularProgress, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { Button } from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { demarrerProjetAction } from '@/actions/demarrer-projet.action';
import TerritoireAutocomplete, { TerritoireAutocompleteProps } from '@/components/TerritoireAutocomplete';
import { OrganisationTypeKey, OrganizationType } from '@/infra/at/organization-type';

export type RechercherAidesFormState = {
  message: string;
  uuid?: SUUID;
};

const initialState: RechercherAidesFormState = {
  message: '',
  uuid: undefined
};

export type SubmitButtonProps = PropsWithChildren<{ loading?: boolean }>;

export function SubmitButton({ children, loading = false }: SubmitButtonProps) {
  const { pending: submitting } = useFormStatus();

  return (
    <Button
      type="submit"
      onClick={function noRefCheck() {}}
      aria-disabled={submitting || loading}
      disabled={submitting || loading}
    >
      {children}
      {'\u00A0'}
      {submitting ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
    </Button>
  );
}

export function RechercherAidesForm() {
  const { pending } = useFormStatus();
  const [audience, setAudience] = useState<string>();
  const [territoire, setTerritoire] = React.useState<TerritoireAutocompleteProps['value']>(null);
  const [formState, formAction] = useFormState(demarrerProjetAction, initialState);
  const [isCharged, setIsCharged] = useState<true | false | undefined>(false);

  useEffect(() => {
    console.log(formState);
    if (formState?.uuid) {
      redirect(`/projets/${formState?.uuid}`);
    }
  }, [formState]);

  return (
    <form action={formAction}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
            options={Object.keys(OrganizationType).map((slug) => ({
              label: OrganizationType[slug as OrganisationTypeKey] as string,
              value: slug
            }))}
            nativeSelectProps={{
              name: 'audience',
              value: audience,
              onChange: (event) => setAudience(event.target.value)
            }}
          />
          <TerritoireAutocomplete value={territoire} setValue={setTerritoire} />
        </Grid>
        <Grid item xs={12}>
          <RadioButtons
            name="payante"
            options={[
              {
                label: 'Aides payantes et gratuites',
                nativeInputProps: {
                  checked: isCharged === undefined,
                  onChange: () => setIsCharged(undefined)
                }
              },
              {
                label: 'Aides payantes',
                nativeInputProps: {
                  value: 'true',
                  checked: isCharged === true,
                  onChange: () => setIsCharged(true)
                }
              },
              {
                label: 'Aides gratuites uniquement',
                nativeInputProps: {
                  value: 'false',
                  checked: isCharged === false,
                  onChange: () => setIsCharged(false)
                }
              }
            ]}
            state="default"
            orientation="horizontal"
          />
          <Checkbox
            legend="Nature de l'aide"
            orientation="horizontal"
            options={[
              {
                label: 'Aide en ingénierie',
                nativeInputProps: {
                  name: 'aid_type_group_slug',
                  value: 'technical-group'
                }
              },
              {
                label: 'Aide financière',
                nativeInputProps: {
                  name: 'aid_type_group_slug',
                  value: 'financial-group'
                }
              }
            ]}
          />

          <Checkbox
            legend="Avancement du projet"
            orientation="horizontal"
            options={[
              {
                label: 'Label checkbox',
                nativeInputProps: {
                  name: 'checkboxes-1',
                  value: 'value1'
                }
              },
              {
                label: 'Label checkbox 2',
                nativeInputProps: {
                  name: 'checkboxes-1',
                  value: 'value2'
                }
              },
              {
                label: 'Label checkbox 3',
                nativeInputProps: {
                  name: 'checkboxes-1',
                  value: 'value3'
                }
              }
            ]}
          />
          <Checkbox
            legend="Actions concernées"
            orientation="horizontal"
            options={[
              {
                label: 'Label checkbox',
                nativeInputProps: {
                  name: 'checkboxes-1',
                  value: 'value1'
                }
              },
              {
                label: 'Label checkbox 2',
                nativeInputProps: {
                  name: 'checkboxes-1',
                  value: 'value2'
                }
              },
              {
                label: 'Label checkbox 3',
                nativeInputProps: {
                  name: 'checkboxes-1',
                  value: 'value3'
                }
              }
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <SubmitButton>Rechercher des aides</SubmitButton>
        </Grid>
      </Grid>
    </form>
  );
}
