/* eslint-disable @next/next/no-img-element */
'use client';

import short, { SUUID } from 'short-uuid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { useRouter } from 'next/navigation';
import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';

import { AidesCompatibles } from '@/presentation/ui/components/AidesCompatibles';
import { GridItemLoader } from '@/presentation/ui/components/GridItemLoader';
import { DynamicAtAidTypeSelect } from '@/presentation/ui/components/DynamicAtAidTypeSelect';
import { ViewAideCompatibleDto } from '@/presentation/ui/dtos/view-aide-compatible.dto';
import { useMountEffect } from '@/presentation/ui/hooks/useMountEffect';
import { rechercherAidesProjetAction } from '@/presentation/ui/actions/rechercher-aides-projet.action';
import { AtAidType } from '@/infra/at/aid-type';
import { AideScore } from '@/domain/models/aide-score';

const translator = short();

type AideCompatiblesTabContentProps = {
  projetSuuid: SUUID;
  initialAidesCompatibles: ViewAideCompatibleDto[];
};
export const AidesCompatiblesTabContent = ({
  projetSuuid,
  initialAidesCompatibles = []
}: AideCompatiblesTabContentProps) => {
  const [aidesCompatibles, setAidesCompatibles] = useState<ViewAideCompatibleDto[]>(initialAidesCompatibles);
  const [filteredAidesCompatibles, setFilteredAidesCompatibles] = useState<ViewAideCompatibleDto[]>(aidesCompatibles);
  const [atAidType, setAtAidType] = useState<AtAidType>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerNouvelleRecherche() {
      setLoading(true);
      // The `response` is updated regularly with newly scored `Aide`.
      const response = await rechercherAidesProjetAction(translator.toUUID(projetSuuid));
      for await (const aideCompatible of readStreamableValue<ViewAideCompatibleDto>(response)) {
        if (ignoreActionResult) {
          continue;
        }

        if (aideCompatible) {
          setAidesCompatibles((previousAidesCompatibles) => previousAidesCompatibles.concat(aideCompatible));
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

  useEffect(() => {
    setFilteredAidesCompatibles(() =>
      aidesCompatibles
        .sort(AideScore.compare)
        .filter(({ aide: { types } }: ViewAideCompatibleDto) =>
          atAidType ? types.map(({ name }) => name).includes(atAidType) : true
        )
        .slice(0, AideScore.SELECTION)
    );
  }, [atAidType, aidesCompatibles]);

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
      <Grid item xs={6}>
        <Button
          onClick={() => router.push(`/projets/${projetSuuid}/preciser/questions`)}
          priority="primary"
          size="large"
          disabled={loading || aidesCompatibles.length === 0}
        >
          Préciser mon projet{'\u00A0'}
          <SearchIcon />
        </Button>
      </Grid>
      <Grid item xs={6}>
        <DynamicAtAidTypeSelect
          setAtAidType={setAtAidType}
          atAidType={atAidType}
          aidesCompatibles={aidesCompatibles}
          loading={loading}
        />
      </Grid>
      <GridItemLoader loading={loading} />
      <AidesCompatibles aidesCompatibles={filteredAidesCompatibles} />
    </Grid>
  );
};
