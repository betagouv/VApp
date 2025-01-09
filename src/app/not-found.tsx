'use client';

import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import { push } from '@socialgouv/matomo-next';

import { ErrorPage } from '@/presentation/ui/components/ErrorPage';

export default function NotFound() {
  useEffect(() => {
    Sentry.captureMessage('Page non trouvée');
    push(['trackEvent', '404', 'Page non trouvée']);
  }, []);

  return (
    <ErrorPage titre="Erreur 404" sousTitre="La page n'a pas été trouvée" statusCode={404}>
      Impossible de trouver la ressource demandée.
      <br />
      Ré-essayez en passant par la <Link href="/">Page d'accueil</Link>.
    </ErrorPage>
  );
}
