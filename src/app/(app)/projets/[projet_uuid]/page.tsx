/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { type Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { AideEligiblesTabContent } from '@/components/AideEligiblesTabContent';
import { aideEligibleAdapter } from '@/presentation/adapter/aide-eligible.adapter';
import { ProjetDescriptionForm } from '@/components/forms/ProjetDescriptionForm';

export const metadata: Metadata = {
  title: 'Projet'
};

export default async function Page({ params: { projet_uuid } }: { params: { projet_uuid: string } }) {
  const projet = await projetRepository.fromUuid(projet_uuid);
  const initialAidesEligibles = await Promise.all(
    projet.aidesEligibles.map(aideEligibleAdapter.toViewAideEligible.bind(aideEligibleAdapter))
  );

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <Tabs
          tabs={[
            {
              label: 'Aides recommandées',
              iconId: 'fr-icon-folder-2-line',
              isDefault: true,
              content: (
                <AideEligiblesTabContent projetUuid={projet.uuid} initialAidesEligibles={initialAidesEligibles} />
              )
            },
            {
              label: 'Description du projet',
              iconId: 'fr-icon-draft-line',
              content: <ProjetDescriptionForm uuid={projet.uuid} description={projet.description} />
            }
          ]}
        />
      </main>
    </div>
  );
}
