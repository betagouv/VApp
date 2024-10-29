/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import { Projet } from '@/domain/models/projet';
import { projetRepository } from '@/infra/repositories/projet.repository';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import { ChoisirAideForm } from '@/components/forms/ChoisirAideForm';
import { aideRepository } from '@/infra/repositories/aide.repository';

export const metadata: Metadata = {
  title: 'Projet | VApp | beta.gouv.fr'
};

export default async function Page({
  params: { projet_uuid },
  searchParams
}: {
  params: { projet_uuid: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const tab = (await searchParams).tab;
  const descriptionOpen = !!(tab && tab === 'description');

  const projet = await projetRepository.fromUuid(projet_uuid);
  const aides = await Promise.all(projet.aidesEligibles.map(({ aideId }) => aideRepository.fromUuid(aideId)));
  const aidesEligibles = projet.aidesEligibles.map(({ eligibilite }, index) => ({
    eligibilite,
    aide: { ...aides[index] }
  }));

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <Tabs
          tabs={[
            {
              label: 'Recommendations',
              iconId: 'fr-icon-folder-2-line',
              isDefault: !descriptionOpen,
              content: <ChoisirAideForm projet={{ ...projet }} aidesEligibles={aidesEligibles} />
            },
            {
              label: 'Description',
              iconId: 'fr-icon-draft-line',
              isDefault: descriptionOpen,
              content: <p>{projet.description}</p>
            }
          ]}
        />
      </main>
    </div>
  );
}
