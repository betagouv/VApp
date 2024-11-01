/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import { projetRepository } from '@/infra/repositories/projet.repository';
import Tabs from '@codegouvfr/react-dsfr/Tabs';
import { AidesEligibles } from '@/components/AideEligibles';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { useRemarkSync } from 'react-remark';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { CircularProgress } from '@mui/material';

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
      <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'end', height: '20px' }}>
        <Button
          linkProps={{
            href: `/projets/${projet.uuid}/questions`
          }}
          priority="primary"
          size="large"
        >
          Vérifier l'égibilité
        </Button>
      </div>
      <main className={fr.cx()}>
        <Tabs
          tabs={[
            {
              label: 'Recommendations',
              iconId: 'fr-icon-folder-2-line',
              isDefault: !descriptionOpen,
              content: <AidesEligibles aidesEligibles={aidesEligibles} />
            },
            {
              label: 'Description',
              iconId: 'fr-icon-draft-line',
              isDefault: descriptionOpen,
              // eslint-disable-next-line react-hooks/rules-of-hooks
              content: <div>{useRemarkSync(projet.description)}</div>
            }
          ]}
        />
      </main>
    </div>
  );
}
