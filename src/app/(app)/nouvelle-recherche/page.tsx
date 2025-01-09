import * as React from 'react';
import { type Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';

import { RechercherAidesForm } from '@/presentation/ui/components/forms/RechercherAidesForm';

export const metadata: Metadata = {
  title: 'Nouvelle recherche'
};

export default async function Page() {
  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <h1>Nouvelle recherche d'aides</h1>
        <RechercherAidesForm />
      </main>
    </div>
  );
}
