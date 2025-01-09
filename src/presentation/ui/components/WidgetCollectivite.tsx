/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import Grid from '@mui/material/Grid';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { rechercherAidesCollectiviteAction } from '@/presentation/ui/actions/rechercher-aides-collectivite.action';
import { GridItemLoader } from '@/presentation/ui/components/GridItemLoader';
import { AidesCompatibles } from '@/presentation/ui/components/AidesCompatibles';
import { useMountEffect } from '@/presentation/ui/hooks/useMountEffect';
import { ViewAideCompatibleDto } from '@/presentation/ui/dtos/view-aide-compatible.dto';

import { AideScore } from '@/domain/models/aide-score';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { Projet } from '@/domain/models/projet';

const WIDGET_SELECTION = 6;

export interface WidgetCollectiviteProps {
  code: ZoneGeographique['code'];
  description: Projet['description'];
  initialAidesCompatibles: ViewAideCompatibleDto[];
}

export default function WidgetCollectivite({
  code,
  description,
  initialAidesCompatibles = []
}: WidgetCollectiviteProps) {
  const [aidesCompatibles, setAidesCompatibles] = useState<ViewAideCompatibleDto[]>(
    initialAidesCompatibles.slice(0, WIDGET_SELECTION)
  );
  const [loading, setLoading] = useState<boolean>(false);
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerNouvelleRecherche() {
      setLoading(true);
      const response = await rechercherAidesCollectiviteAction({ code, description });
      for await (const aideCompatible of readStreamableValue<ViewAideCompatibleDto>(response)) {
        if (ignoreActionResult) {
          continue;
        }

        if (aideCompatible) {
          setAidesCompatibles((previousAidesCompatibles) =>
            previousAidesCompatibles.concat(aideCompatible).sort(AideScore.compare).slice(0, WIDGET_SELECTION)
          );
        }
      }
      setLoading(false);
    }

    if (aidesCompatibles.length === 0) {
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
        {!loading && aidesCompatibles.length > 0 && (
          <Alert
            closable
            title={`Voici les ${aidesCompatibles.length} aides qui correspondent le mieux à votre projet`}
            description=""
            severity="success"
            small
          />
        )}
      </Grid>
      <GridItemLoader loading={loading} />
      <AidesCompatibles aidesCompatibles={aidesCompatibles} />
    </Grid>
  );
}
