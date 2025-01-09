/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { type Metadata } from 'next';
import { SUUID } from 'short-uuid';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';

import { aideCompatibleAdapter } from '@/container';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { AidesCompatiblesTabContent } from '@/presentation/ui/components/AidesCompatiblesTabContent';
import { ProjetDescriptionForm } from '@/presentation/ui/components/forms/ProjetDescriptionForm';

export const metadata: Metadata = {
  title: 'Projet'
};

export default async function Page({ params: { projet_uuid } }: { params: { projet_uuid: string } }) {
  const projet = await projetRepository.fromSuuid(projet_uuid as SUUID);
  const initialAidesCompatibles = await Promise.all(
    projet.getSortedAideScores().map(aideCompatibleAdapter.toViewAideCompatible.bind(aideCompatibleAdapter))
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
                <AidesCompatiblesTabContent
                  projetSuuid={projet.suuid}
                  initialAidesCompatibles={initialAidesCompatibles}
                />
              )
            },
            {
              label: 'Description du projet',
              iconId: 'fr-icon-draft-line',
              content: <ProjetDescriptionForm suuid={projet.suuid} description={projet.description} />
            }
          ]}
        />
      </main>
    </div>
  );
}
