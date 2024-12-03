/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';

import { rechercherAidesCollectiviteAction } from '@/actions/rechercher-aides-collectivite.action';
import Grid from '@mui/material/Grid';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { GridItemLoader } from '@/components/GridItemLoader';
import { AidesEligibles } from '@/components/AideEligibles';
import { useMountEffect } from '@/presentation/hooks/useMountEffect';
import { useState } from 'react';
import { ViewAideEligible } from '@/presentation/dtos/view-aide-eligible';
import { readStreamableValue } from 'ai/rsc';
import { AideEligible } from '@/domain/models/aide-eligible';
import { Territoire } from '@/domain/models/territoire';
import { Projet } from '@/domain/models/projet';

export interface WidgetCollectiviteProps {
  code: Territoire['code'];
  description: Projet['description'];
}

export default function WidgetCollectivite({ code, description }: WidgetCollectiviteProps) {
  const [aidesEligibles, setAidesEligibles] = useState<ViewAideEligible[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerNouvelleRecherche() {
      setLoading(true);
      const response = await rechercherAidesCollectiviteAction({ code, description });
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
      <GridItemLoader loading={loading} />
      <AidesEligibles aidesEligibles={aidesEligibles} />
    </Grid>
  );
}
