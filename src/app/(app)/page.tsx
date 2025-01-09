import * as React from 'react';
import { Suspense } from 'react';
import { type Metadata } from 'next';
import { Button } from '@codegouvfr/react-dsfr/Button';

import { NombreAides } from '@/presentation/ui/components/NombreAides';
import { Loader } from '@/presentation/ui/components/Loader';

export const metadata: Metadata = {
  title: 'Accueil'
};

const Home = () => {
  return (
    <main>
      <h1>Collectivités</h1>
      <h2>Financez vos projets en identifiant toutes les aides que vous pourriez mobiliser, en 5 minutes</h2>
      <p>
        <Suspense fallback={<Loader size={26} />}>
          <NombreAides />
        </Suspense>
      </p>
      <section className="col-start-2 mt-4">
        <Button
          linkProps={{
            href: '/nouvelle-recherche'
          }}
        >
          Rechercher des aides
        </Button>
      </section>
    </main>
  );
};

export default Home;
