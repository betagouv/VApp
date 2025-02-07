/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { SUUID } from 'short-uuid';
import { fr } from '@codegouvfr/react-dsfr';
import { QuestionsProjetForm } from '@/presentation/ui/components/forms/QuestionsProjetForm';

export default async function Page({ params: { projet_suuid } }: { params: { projet_suuid: SUUID } }) {
  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <h1>Précisez votre projet en répondant à quelques questions</h1>
        <QuestionsProjetForm projetSuuid={projet_suuid} />
      </main>
    </div>
  );
}
