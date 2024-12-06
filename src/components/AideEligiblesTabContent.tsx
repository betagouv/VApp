/* eslint-disable @next/next/no-img-element */
'use client';

import { SUUID } from 'short-uuid';
import * as React from 'react';
import { useEffect, useState } from 'react';
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
import { rechercherAidesProjetAction } from '@/actions/rechercher-aides-projet.action';
import { AideEligible } from '@/domain/models/aide-eligible';
import { useRouter } from 'next/navigation';
import { DynamicAtAidTypeSelect } from '@/components/DynamicAtAidTypeSelect';
import { AtAidType } from '@/infra/at/aid-type';

export const metadata: Metadata = {
  title: 'Projet | VApp | beta.gouv.fr'
};

type AideEligiblesTabContentProps = {
  projetUuid: SUUID;
  initialAidesEligibles: ViewAideEligible[];
};
export const AideEligiblesTabContent = ({ projetUuid, initialAidesEligibles = [] }: AideEligiblesTabContentProps) => {
  const [aidesEligibles, setAidesEligibles] = useState<ViewAideEligible[]>(initialAidesEligibles);
  const [filteredAidesEligibles, setFilteredAidesEligibles] = useState<ViewAideEligible[]>(aidesEligibles);
  const [atAidType, setAtAidType] = useState<AtAidType>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerNouvelleRecherche() {
      setLoading(true);
      // The `response` is updated regularly with newly scored `Aide`.
      const response = await rechercherAidesProjetAction(projetUuid);
      for await (const aideEligible of readStreamableValue<ViewAideEligible>(response)) {
        if (ignoreActionResult) {
          continue;
        }

        if (aideEligible) {
          setAidesEligibles((previousAidesEligibles) => previousAidesEligibles.concat(aideEligible));
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

  useEffect(() => {
    setFilteredAidesEligibles(() =>
      aidesEligibles
        .sort(AideEligible.compare)
        .filter(({ aide: { types } }: ViewAideEligible) =>
          atAidType ? types.map(({ name }) => name).includes(atAidType) : true
        )
        .slice(0, AideEligible.SELECTION)
    );
  }, [atAidType, aidesEligibles]);

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
      <Grid item xs={6}>
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
      <Grid item xs={6}>
        <DynamicAtAidTypeSelect
          setAtAidType={setAtAidType}
          atAidType={atAidType}
          aidesEligibles={aidesEligibles}
          loading={loading}
        />
      </Grid>
      <GridItemLoader loading={loading} />
      <AidesEligibles aidesEligibles={filteredAidesEligibles} />
    </Grid>
  );
};
