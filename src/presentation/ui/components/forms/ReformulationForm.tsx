'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { readStreamableValue, useActions, useUIState } from 'ai/rsc';
import { redirect } from 'next/navigation';
import Input from '@codegouvfr/react-dsfr/Input';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { SubmitButton } from '@/presentation/ui/components/SubmitButton';
import { validerReformulationAction } from '@/presentation/ui/actions/valider-reformulation.action';
import { ClassProperties } from '@/presentation/types';
import { QuestionsReponsesProvider } from '@/presentation/ui/ai';
import { useMountEffect } from '@/presentation/ui/hooks/useMountEffect';

import { Projet } from '@/domain/models/projet';
import { AideId } from '@/domain/models/aide.interface';

export type ReformulationFormState = {
  message: string;
  isValid?: boolean;
};

const initialState: ReformulationFormState = {
  message: '',
  isValid: undefined
};

export interface ReformulationFormProps {
  projet: ClassProperties<Projet>;
  aideId?: AideId;
}

export function ReformulationForm({ projet }: ReformulationFormProps) {
  const [{ questionsReponses }] = useUIState<typeof QuestionsReponsesProvider>();
  const { reformulerAction } = useActions<typeof QuestionsReponsesProvider>();
  const [loading, setLoading] = useState<boolean>(false);

  const [formState, formAction] = useFormState(validerReformulationAction, initialState);
  const [reformulation, setReformulation] = useState('');

  useMountEffect(() => {
    let ignore = false;
    async function reformuler() {
      setLoading(true);
      setReformulation('');
      const { response, streaming } = await reformulerAction(projet.suuid, questionsReponses);
      for await (const reponseDelta of readStreamableValue<string>(response)) {
        if (!ignore) {
          setReformulation(reformulation.concat(reponseDelta || ''));
        }
      }
      for await (const streamingDelta of readStreamableValue<boolean>(streaming)) {
        if (streamingDelta) {
          setLoading(streamingDelta);
        }
      }
      setLoading(false);
    }

    reformuler();
    return () => {
      ignore = true;
      setLoading(false);
    };
  });

  useEffect(() => {
    if (formState?.isValid) {
      redirect(`/projets/${projet.suuid}`);
    }
  }, [formState, projet.suuid]);

  return (
    <form action={formAction}>
      {loading && (
        <Alert severity="info" title="Grâce à vos réponses, le projet peut maintenant être reformulé." closable />
      )}
      <input type="hidden" name="projetId" value={projet.suuid} />
      <Input
        label="Reformulation du projet"
        textArea
        id="reformulation"
        hintText="Vous pouvez egalement l'ajuster manuellement"
        nativeTextAreaProps={{
          style: { minHeight: '700px' },
          name: 'reformulation',
          value: reformulation,
          readOnly: loading,
          onChange: (e) => {
            setReformulation(e.target.value);
          }
        }}
      />
      <SubmitButton loading={loading}>Réévaluer l'égibilité aux aides</SubmitButton>
    </form>
  );
}
