/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import { type Metadata } from 'next';
import { SUUID } from 'short-uuid';
import { fr } from '@codegouvfr/react-dsfr';
import { projetRepository } from '@/infra/repositories/projet.repository';

export const metadata: Metadata = {
  title: 'Projet debug page'
};

export default async function Page({ params: { projet_suuid } }: { params: { projet_suuid: string } }) {
  const projet = await projetRepository.fromSuuid(projet_suuid as SUUID);

  return (
    <div className={fr.cx('fr-grid-row', 'fr-grid-row--center')}>
      <main>
        <dl>
          <dt>uuid</dt>
          <dd>{projet.uuid}</dd>

          <dt>Porteur</dt>
          <dd>{projet.porteur}</dd>

          <dt>Zone(s) géographique(s)</dt>
          <dd>
            {projet.zonesGeographiques.map(({ id, nom, code, type }) => `${id} ${nom} ${code} ${type}`).join(', ')}
          </dd>

          <dt>Etat d'avancement</dt>
          <dd>{projet.etatAvancement}</dd>

          <dt>Critères de recherche</dt>

          <dd>
            <dl>
              <dt>payante</dt>
              <dd>{projet.criteresRechercheAide.payante}</dd>
              <dt>natures</dt>
              <dd>{(projet.criteresRechercheAide.natures || []).join(', ')}</dd>
              <dt>actions concernées</dt>
              <dd>{(projet.criteresRechercheAide.actionsConcernees || []).join(', ')}</dd>
            </dl>
          </dd>
        </dl>
      </main>
    </div>
  );
}
