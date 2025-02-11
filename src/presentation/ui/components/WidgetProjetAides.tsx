/* eslint-disable @next/next/no-img-element */
'use client';

import * as React from 'react';
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import Grid from '@mui/material/Grid';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { GridItemLoader } from '@/presentation/ui/components/GridItemLoader';
import { AidesCompatibles } from '@/presentation/ui/components/AidesCompatibles';
import { useMountEffect } from '@/presentation/ui/hooks/useMountEffect';
import { ViewAideEvalueeDto } from '@/presentation/ui/dtos/view-aide-evaluee.dto';
import { rechercherAidesProjetAction } from '@/presentation/ui/actions/rechercher-aides-projet.action';

import { AideScore } from '@/domain/models/aide-score';
import { Projet } from '@/domain/models/projet';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

const WIDGET_SELECTION = 6;

export interface WidgetProjetAidesProps {
  projetId: Projet['uuid'];
  initialAidesCompatibles: ViewAideEvalueeDto[];
  criteres?: CriteresRechercheAide;
}

export default function WidgetProjetAides({
  projetId,
  initialAidesCompatibles = [],
  criteres
}: WidgetProjetAidesProps) {
  const [aidesCompatibles, setAidesCompatibles] = useState<ViewAideEvalueeDto[]>(initialAidesCompatibles);
  const [loading, setLoading] = useState<boolean>(false);
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerNouvelleRecherche() {
      setLoading(true);
      const response = await rechercherAidesProjetAction(projetId, criteres);
      for await (const aideCompatible of readStreamableValue<ViewAideEvalueeDto>(response)) {
        if (ignoreActionResult) {
          continue;
        }

        if (aideCompatible) {
          setAidesCompatibles((previousAidesCompatibles) => {
            if (!previousAidesCompatibles.find(({ aide: { id } }) => id === aideCompatible.aide.id)) {
              return previousAidesCompatibles.concat(aideCompatible).sort(AideScore.compare);
            }
            return previousAidesCompatibles;
          });
        }
      }
      setLoading(false);
    }

    triggerNouvelleRecherche();

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
        {!loading && aidesCompatibles.length === 0 && (
          <Alert
            title={`Aucune aide n'a été trouvée pour votre projet. Quelque chose à du mal se passer...`}
            description=""
            severity="error"
            small
          />
        )}

        {!loading && aidesCompatibles.length > 0 && (
          <Alert
            closable
            title={`Voici les aides qui correspondent le mieux à votre projet`}
            description=""
            severity="success"
            small
          />
        )}
      </Grid>
      <GridItemLoader loading={loading} />
      <AidesCompatibles aidesCompatibles={aidesCompatibles.slice(0, WIDGET_SELECTION)} />
    </Grid>
  );
}
