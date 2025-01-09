'use client';

import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { useEffect } from 'react';
import Link from 'next/link';
import { ErrorPage } from '@/presentation/ui/components/ErrorPage';
import { push } from '@socialgouv/matomo-next';

// eslint-disable-next-line import/no-default-export
export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
    push(['trackEvent', '500', JSON.stringify(error)]);
  }, [error]);

  return (
    <html lang="fr">
      <body>
        <ErrorPage
          titre="Erreur 500"
          sousTitre="Une erreur s'est produite lors de l'execution de la page"
          statusCode={500}
        >
          <p className="fr-text--xl">
            Nos équipes ont été notifiées et interviendront dans les meilleurs délais.
            <br />
            Ré-essayez en passant par la <Link href="/">Page d'accueil</Link>
          </p>
        </ErrorPage>
      </body>
    </html>
  );
}
