import * as React from 'react';
import { Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import { projetRepository } from '../../../infra/repositories/projet.repository';
import { dummyAideRepository } from '../../../../tests-vitest/infra/repository/dummy-aide.repository';

export const metadata: Metadata = {
  title: 'Nouvelle recherche | VApp | beta.gouv.fr'
};

export async function generateStaticParams() {
  const projets = await projetRepository.all();

  return projets.map((projet) => ({ uuid: projet.uuid }));
}

export default async function Page({ params: { uuid } }: { params: { uuid: string } }) {
  const projet = await projetRepository.fromUuid(uuid);
  const aides = await Promise.all(projet.recommendations.map(({ aideId }) => dummyAideRepository.fromUuid(aideId)));
  const recommendations = projet.recommendations.map(({ eligibilite }, index) => ({ eligibilite, aide: aides[index] }));

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <h1>Recommendations</h1>
        {recommendations.map(({ eligibilite, aide }) => (
          <li key={aide.uuid}>
            {eligibilite} {aide.nom}
          </li>
        ))}
      </main>
    </div>
  );
}
