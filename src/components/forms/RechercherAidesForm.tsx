'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { redirect } from 'next/navigation';
import { SUUID } from 'short-uuid';
import { Grid } from '@mui/material';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { SubmitButton } from '@/components/SubmitButton';
import TerritoireAutocomplete, { TerritoireAutocompleteProps } from '@/components/TerritoireAutocomplete';
import { toggleValueInStateArray } from '@/libs/utils/array';
import { atOrganizationTypeLabels } from '@/infra/at/organization-type';
import { atAidTypeGroupLabels } from '@/infra/at/aid-type-group';
import { atAidStepLabels } from '@/infra/at/aid-step';
import { atAidDestinationLabels } from '@/infra/at/aid-destination';
import { demarrerProjetAction } from '@/actions/demarrer-projet.action';

export type RechercherAidesFormState = {
  message: string;
  uuid?: SUUID;
};

const initialState: RechercherAidesFormState = {
  message: '',
  uuid: undefined
};

export function RechercherAidesForm() {
  const { pending } = useFormStatus();
  const [audience, setAudience] = useState<string>();
  const [territoire, setTerritoire] = React.useState<TerritoireAutocompleteProps['value']>(null);
  const [formState, formAction] = useFormState(demarrerProjetAction, initialState);
  const [isCharged, setIsCharged] = useState<true | false | undefined>(false);
  const [groupTypes, setGroupTypes] = useState<string[]>(['financial-group']);
  const [steps, setSteps] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  useEffect(() => {
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
            options={Object.entries(atOrganizationTypeLabels).map(([value, label]) => ({
              label,
              value
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
            options={Object.entries(atAidTypeGroupLabels).map(([value, label]) => ({
              label,
              nativeInputProps: {
                name: 'aideNatures',
                value,
                checked: groupTypes.includes(value),
                onChange: () => setGroupTypes(toggleValueInStateArray(value))
              }
            }))}
          />
          <Checkbox
            legend="Avancement du projet"
            orientation="horizontal"
            options={Object.entries(atAidStepLabels).map(([value, label]) => ({
              label,
              nativeInputProps: {
                name: 'etatsAvancements',
                value,
                checked: steps.includes(value),
                onChange: () => setSteps(toggleValueInStateArray(value))
              }
            }))}
          />
          <Checkbox
            legend="Actions concernées"
            orientation="horizontal"
            options={Object.entries(atAidDestinationLabels).map(([value, label]) => ({
              label,
              nativeInputProps: {
                name: 'actionsConcernees',
                value,
                checked: destinations.includes(value),
                onChange: () => setDestinations(toggleValueInStateArray(value))
              }
            }))}
          />
        </Grid>
        <Grid item xs={12}>
          <SubmitButton>Rechercher des aides</SubmitButton>
        </Grid>
      </Grid>
    </form>
  );
}
