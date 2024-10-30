'use client';

import * as React from 'react';

import { Button } from '@codegouvfr/react-dsfr/Button';
import { AidesEligiblesList } from '@/components/AidesEligiblesList';
import { Projet } from '@/domain/models/projet';
import { AideEligible } from '@/domain/models/aide-eligible';
import { useRouter } from 'next/navigation';
import { Aide } from '@/domain/models/aide';

export type ViewAideEligible = Pick<AideEligible, 'eligibilite'> & { aide: Aide };

export type ChoisirAideFormProps = {
  projet: Pick<Projet, 'uuid'>;
  aidesEligibles: ViewAideEligible[];
};

export function ChoisirAideForm({ projet, aidesEligibles }: ChoisirAideFormProps) {
  const router = useRouter();
  const redirectToQuestions = () => {
    router.push(`/projets/${projet.uuid}/questions`);
  };

  return (
    <form action={redirectToQuestions}>
      <AidesEligiblesList aidesEligibles={aidesEligibles} />
      <Button type="submit" onClick={function noRefCheck() {}}>
        Vérifier l'eligibilité
      </Button>
    </form>
  );
}
