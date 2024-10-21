import * as React from 'react';
import { type Metadata } from 'next';

import { Button } from '@codegouvfr/react-dsfr/Button';
import { config } from '@/config';
import { sharedMetadata } from './shared-metadata';

const title = `Accueil - ${config.name}`;
const url = '/';

export const metadata: Metadata = {
  ...sharedMetadata,
  title,
  openGraph: {
    ...sharedMetadata.openGraph,
    title,
    url
  },
  alternates: {
    canonical: url
  }
};

const Home = () => {
  return (
    <>
      <section className="col-start-2 mt-4">
        <Button
          linkProps={{
            href: '/nouvelle-recherche'
          }}
        >
          Rechercher des aides
        </Button>
      </section>
    </>
  );
};

export default Home;
