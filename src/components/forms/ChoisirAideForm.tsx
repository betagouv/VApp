'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import { demarrerProjetAction } from '@/actions/demarrer-projet.action';

import { Button } from '@codegouvfr/react-dsfr/Button';
import { RecommendationList } from '@/components/RecommendationList';
import { Projet } from '@/domain/models/projet';
import { AideEligible } from '@/domain/models/aide-eligible';

const initialState = {
  message: '',
  uuid: undefined
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" onClick={function noRefCheck() {}} aria-disabled={pending} disabled={pending}>
      Vérifier l'eligibilité
    </Button>
  );
}

export type ChoisirAideFormProps = {
  projet: Pick<Projet, 'uuid'>;
  aidesEligibles: AideEligible[];
};

export function ChoisirAideForm({ projet, aidesEligibles }: ChoisirAideFormProps) {
  const [formState, formAction] = useFormState(demarrerProjetAction, initialState);
  const { pending } = useFormStatus();

  return (
    <form action={formAction}>
      <input type="hidden" name="projet_uuid" value={projet.uuid} />
      <RecommendationList aidesEligibles={aidesEligibles} />
      <SubmitButton />
    </form>
  );
}
