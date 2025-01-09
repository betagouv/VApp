'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { SubmitButton } from '@/presentation/ui/components/SubmitButton';
import { editerProjetDescriptionAction } from '@/presentation/ui/actions/editer-projet-description.action';
import { Projet } from '@/domain/models/projet';

export type ProjetDescriptionFormState = {
  message: string;
  isValid?: boolean;
};

const initialState: ProjetDescriptionFormState = {
  message: '',
  isValid: undefined
};

export type ProjetDescriptionFormProps = Pick<Projet, 'suuid' | 'description'>;

export function ProjetDescriptionForm({ suuid, description: initialDescription }: ProjetDescriptionFormProps) {
  const [formState, formAction] = useFormState(editerProjetDescriptionAction, initialState);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (formState?.isValid) {
      redirect(`/projets/${suuid}`);
    }
  }, [formState, suuid]);

  return (
    <form action={formAction}>
      {formState?.isValid === false && <Alert severity="error" title={formState.message} closable />}
      <input type="hidden" name="suuid" value={suuid} />
      <Input
        textArea
        label={''}
        id="description"
        nativeTextAreaProps={{
          style: { minHeight: '700px' },
          name: 'description',
          value: description,
          onChange: (e) => {
            setDescription(e.target.value);
          }
        }}
      />
      <SubmitButton>Réévaluer l'égibilité aux aides</SubmitButton>
    </form>
  );
}
