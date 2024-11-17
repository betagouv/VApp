/* eslint-disable @next/next/no-img-element */
'use client';

import { SUUID } from 'short-uuid';
import * as React from 'react';
import { useState } from 'react';
import { Metadata } from 'next';
import { readStreamableValue } from 'ai/rsc';
import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';

import { AidesEligibles } from '@/components/AideEligibles';
import { GridItemLoader } from '@/components/GridItemLoader';
import { ViewAideEligible } from '@/presentation/dtos/view-aide-eligible';
import { useMountEffect } from '@/presentation/hooks/useMountEffect';
import { rechercherAidesEligiblesAction } from '@/actions/rechercher-aides-eligibles.action';
import { AideEligible } from '@/domain/models/aide-eligible';
import { useRouter } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Projet | VApp | beta.gouv.fr'
};

type AideEligiblesTabContentProps = {
  projetUuid: SUUID;
  initialAidesEligibles: ViewAideEligible[];
};
export const AideEligiblesTabContent = ({ projetUuid, initialAidesEligibles = [] }: AideEligiblesTabContentProps) => {
  const [aidesEligibles, setAidesEligibles] = useState<ViewAideEligible[]>(initialAidesEligibles);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerNouvelleRecherche() {
      setLoading(true);
      const response = await rechercherAidesEligiblesAction(projetUuid);
      for await (const aideEligible of readStreamableValue<ViewAideEligible>(response)) {
        if (ignoreActionResult) {
          continue;
        }

        if (aideEligible) {
          setAidesEligibles((previousAidesEligibles) =>
            previousAidesEligibles.concat(aideEligible).sort(AideEligible.compare).slice(0, AideEligible.SELECTION)
          );
        }
      }
      setLoading(false);
    }

    if (aidesEligibles.length === 0) {
      triggerNouvelleRecherche();
    }

    return () => {
      ignoreActionResult = true;
    };
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {loading && (
          <Alert
            title={`Nous recherchons les aides correspondants le mieux à votre projet...`}
            description=""
            severity="info"
            small
          />
        )}
        {!loading && aidesEligibles.length > 0 && (
          <Alert
            closable
            title={`Voici les ${aidesEligibles.length} aides qui correspondent le mieux à votre projet`}
            description=""
            severity="success"
            small
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <Button
          onClick={() => router.push(`/projets/${projetUuid}/preciser/questions`)}
          priority="primary"
          size="large"
          disabled={loading || aidesEligibles.length === 0}
        >
          Préciser mon projet{'\u00A0'}
          <SearchIcon />
        </Button>
      </Grid>
      <GridItemLoader loading={loading} />
      <AidesEligibles aidesEligibles={aidesEligibles} />
    </Grid>
  );
};
