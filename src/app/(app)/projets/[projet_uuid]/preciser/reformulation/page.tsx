/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { SUUID } from 'short-uuid';
import { fr } from '@codegouvfr/react-dsfr';
import { ReformulationForm } from '@/components/forms/ReformulationForm';
import { projetRepository } from '@/infra/repositories/projet.repository';

export default async function Page({ params: { projet_uuid } }: { params: { projet_uuid: SUUID } }) {
  const projet = await projetRepository.fromUuid(projet_uuid);

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <ReformulationForm projet={{ ...projet }} />
      </main>
    </div>
  );
}
