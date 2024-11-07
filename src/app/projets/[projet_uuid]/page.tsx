/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { Metadata } from 'next';
import { useRemarkSync } from 'react-remark';
import { fr } from '@codegouvfr/react-dsfr';
import Tabs from '@codegouvfr/react-dsfr/Tabs';

import { AidesEligibles } from '@/components/AideEligibles';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { aideRepository } from '@/infra/repositories/aide.repository';
import Alert from '@codegouvfr/react-dsfr/Alert';

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
    aide: aides[index]
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
              content: <AidesEligibles aidesEligibles={aidesEligibles} projet={projet} />
            },
            {
              label: 'Description',
              iconId: 'fr-icon-draft-line',
              isDefault: descriptionOpen,
              // eslint-disable-next-line react-hooks/rules-of-hooks
              content: (
                <div>
                  {descriptionOpen && (
                    <Alert
                      severity="info"
                      title="Le projet a été reformulé grâce à vos réponses. Vous pouvez consulter les nouvelles aides recommandées."
                      closable
                    />
                  )}
                  {useRemarkSync(projet.description)}
                </div>
              )
            }
          ]}
        />
      </main>
    </div>
  );
}
