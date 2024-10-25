/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { Metadata } from 'next';
import { fr } from '@codegouvfr/react-dsfr';
import { Projet } from '@/domain/models/projet';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { QuestionsProjetPourAideForm } from '@/components/forms/QuestionsProjetPourAideForm';

export const metadata: Metadata = {
  title: 'Questions | Aide | VApp | beta.gouv.fr'
};

export async function generateStaticParams() {
  const projets = await projetRepository.all();

  return projets.map((projet: Projet) => ({ uuid: projet.uuid }));
}

export default async function Page({ params: { uuid } }: { params: { uuid: string } }) {
  const projet = await projetRepository.fromUuid(uuid);

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <QuestionsProjetPourAideForm questions={} />
      </main>
    </div>
  );
}
