/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import { Projet } from '@/domain/models/projet';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { useRecommendationsAvecAides } from '@/presentation/useRecommendationsAvecAides';

export const metadata: Metadata = {
  title: 'Nouvelle recherche | VApp | beta.gouv.fr'
};

export async function generateStaticParams() {
  const projets = await projetRepository.all();

  return projets.map((projet: Projet) => ({ uuid: projet.uuid }));
}

export default async function Page({ params: { uuid } }: { params: { uuid: string } }) {
  const projet = await projetRepository.fromUuid(uuid);
  const recommendationsAvecAides = useRecommendationsAvecAides(projet);

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <h1>Recommendations</h1>
        <RadioButtons
          legend="Légende pour l’ensemble de champs"
          name="radio"
          options={recommendationsAvecAides.map(({ eligibilite, aide }) => ({
            illustration: <img alt={String(eligibilite)} src="https://placehold.it/100x100" />,
            label: aide.nom,
            nativeInputProps: {
              value: aide.uuid
            },
            hintText: aide.description
          }))}
          state="default"
          stateRelatedMessage="State description"
        />
      </main>
    </div>
  );
}
