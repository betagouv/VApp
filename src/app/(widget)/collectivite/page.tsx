/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { Metadata } from 'next';

import WidgetCollectivite from '@/components/WidgetCollectivite';

export const metadata: Metadata = {
  title: 'Projet | VApp | beta.gouv.fr'
};

export default async function Page({ searchParams }: { searchParams: Promise<{ code: string; description: string }> }) {
  const { code, description } = await searchParams;
  if (!code) {
    throw new Error('Le code INSEE de la commune est manquant.');
  }

  if (!description) {
    throw new Error('La description du projet est vide.');
  }

  return <WidgetCollectivite code={code} description={description} />;
}
