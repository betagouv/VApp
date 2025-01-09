/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { type Metadata } from 'next';

import { aideCompatibleAdapter } from '@/container';
import { projetRepository } from '@/infra/repositories/projet.repository';
import WidgetCollectivite from '@/presentation/ui/components/WidgetCollectivite';
import { ViewAideCompatibleDto } from '@/presentation/ui/dtos/view-aide-compatible.dto';

export const metadata: Metadata = {
  title: 'Widget MEC'
};

export default async function Page({ searchParams }: { searchParams: Promise<{ code: string; description: string }> }) {
  const { code, description } = await searchParams;
  if (!code) {
    throw new Error('Le code INSEE de la commune est manquant.');
  }

  if (!description) {
    throw new Error('La description du projet est vide.');
  }

  let initialAidesCompatibles: ViewAideCompatibleDto[] = [];
  const projet = await projetRepository.findForCommune(code, description);
  if (projet) {
    initialAidesCompatibles = await Promise.all(
      projet.getSortedAideScores().map(aideCompatibleAdapter.toViewAideCompatible.bind(aideCompatibleAdapter))
    );
  }

  return <WidgetCollectivite code={code} description={description} initialAidesCompatibles={initialAidesCompatibles} />;
}
