/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UUID } from 'short-uuid';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { criteresRechercheAidesDtoSchema } from '@/presentation/api/dtos/criteres-recherche-aides.dto';
import WidgetProjetAides from '@/presentation/ui/components/WidgetProjetAides';
import { aideCompatibleAdapter } from '@/container';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import type { Projet } from '@/domain/models/projet';

export const metadata: Metadata = {
  title: 'Widget'
};

export default async function Page({
  params: { projetId },
  searchParams
}: {
  params: { projetId: string };
  searchParams: Promise<{ payante?: string; natures?: string; actionsConcernees?: string }>;
}) {
  const projet = await projetRepository.findOneById(projetId as UUID);
  if (!projet) {
    return notFound();
  }

  const criteres: CriteresRechercheAide = criteresRechercheAidesDtoSchema.parse(searchParams);
  const initialAidesCompatibles = await Promise.all(
    Array.from(projet.aidesScores, ([, aideScore]) => aideCompatibleAdapter.toViewAideCompatible(aideScore))
  );

  return (
    <WidgetProjetAides
      projetId={projetId as Projet['uuid']}
      initialAidesCompatibles={initialAidesCompatibles}
      criteres={criteres}
    />
  );
}
