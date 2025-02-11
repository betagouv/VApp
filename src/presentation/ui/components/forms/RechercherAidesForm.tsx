'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { redirect } from 'next/navigation';
import { SUUID } from 'short-uuid';
import { Grid } from '@mui/material';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { atOrganizationTypeLabels, AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { atAidTypeGroupLabels } from '@/infra/at/aid-type-group';
import { AtAidStep, atAidStepLabels } from '@/infra/at/aid-step';
import { AtAidDestination, atAidDestinationLabels } from '@/infra/at/aid-destination';

import { SubmitButton } from '@/presentation/ui/components/SubmitButton';
import TerritoireAutocomplete, {
  TerritoireAutocompleteProps
} from '@/presentation/ui/components/TerritoireAutocomplete';
import { toggleValueInStateArray } from '@/presentation/ui/utils/array';
import { demarrerProjetAction } from '@/presentation/ui/actions/demarrer-projet.action';

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
  const [porteur, setPorteur] = useState<AtOrganizationTypeSlug>(AtOrganizationTypeSlug.Commune);
  const [territoire, setTerritoire] = React.useState<TerritoireAutocompleteProps['value']>(null);
  const [formState, formAction] = useFormState(demarrerProjetAction, initialState);
  const [isCharged, setIsCharged] = useState<true | false | undefined>(false);
  const [groupTypes, setGroupTypes] = useState<string[]>(['financial-group']);
  const [etatAvancement, setEtatAvancement] = useState<AtAidStep>(AtAidStep.Reflexion);
  const [actionConcernes, setActionsConcernees] = useState<AtAidDestination[]>([]);

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
            label="Type de porteur"
            options={Object.entries(atOrganizationTypeLabels).map(([value, label]) => ({
              label,
              value
            }))}
            nativeSelectProps={{
              name: 'porteur',
              value: porteur,
              onChange: (event) => setPorteur(event.target.value as AtOrganizationTypeSlug)
            }}
          />
          <RadioButtons
            legend="Avancement du projet"
            orientation="horizontal"
            options={Object.entries(atAidStepLabels).map(([value, label]) => ({
              label,
              nativeInputProps: {
                name: 'etatAvancement',
                value,
                checked: etatAvancement === value,
                onChange: (event) => setEtatAvancement(event.target.value as AtAidStep)
              }
            }))}
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
            legend="Actions concernées"
            orientation="horizontal"
            options={Object.entries(atAidDestinationLabels).map(([value, label]) => ({
              label,
              nativeInputProps: {
                name: 'actionsConcernees',
                value,
                checked: actionConcernes.includes(value as AtAidDestination),
                onChange: (event) =>
                  setActionsConcernees(toggleValueInStateArray(event.target.value as AtAidDestination))
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
