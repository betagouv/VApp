/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { SUUID } from 'short-uuid';
import { fr } from '@codegouvfr/react-dsfr';
import { QuestionsProjetPourAideForm } from '@/components/forms/QuestionsProjetPourAideForm';
import { poserQuestionAction } from '@/actions/poser-questions.action';

export default async function Page({
  params: { projet_uuid, aide_uuid }
}: {
  params: { projet_uuid: SUUID; aide_uuid: SUUID };
}) {
  const questions = await poserQuestionAction(projet_uuid, aide_uuid);

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main className={fr.cx()}>
        <h1>Précisez votre projet en répondant à ces 3 questions</h1>
        <QuestionsProjetPourAideForm questions={questions} projetUuid={projet_uuid} aideUuid={aide_uuid} />
      </main>
    </div>
  );
}
