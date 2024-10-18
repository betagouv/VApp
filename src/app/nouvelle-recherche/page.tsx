import * as React from 'react';
import { Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import { RechercherAidesForm } from '../../components/forms/RechercherAidesForm';

export const metadata: Metadata = {
  title: 'Nouvelle recherche | VApp | beta.gouv.fr'
};

export default async function Page() {
  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <h1>Rechercher des aides</h1>
        <RechercherAidesForm />
      </main>
    </div>
  );
}
