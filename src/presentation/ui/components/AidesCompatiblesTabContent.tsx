/* eslint-disable @next/next/no-img-element */
'use client';

import short, { SUUID } from 'short-uuid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import { push } from '@socialgouv/matomo-next';

import { AtAidType } from '@/infra/at/aid-type';
import { AideScore } from '@/domain/models/aide-score';
import { AidesCompatibles } from '@/presentation/ui/components/AidesCompatibles';
import { GridItemLoader } from '@/presentation/ui/components/GridItemLoader';
import { DynamicAtAidTypeSelect } from '@/presentation/ui/components/DynamicAtAidTypeSelect';
import { ViewAideEvalueeDto } from '@/presentation/ui/dtos/view-aide-evaluee.dto';
import { useMountEffect } from '@/presentation/ui/hooks/useMountEffect';
import { rechercherAidesProjetAction } from '@/presentation/ui/actions/rechercher-aides-projet.action';

const translator = short();

type AideCompatiblesTabContentProps = {
  projetSuuid: SUUID;
  initialAidesCompatibles: ViewAideEvalueeDto[];
};
export const AidesCompatiblesTabContent = ({
  projetSuuid,
  initialAidesCompatibles = []
}: AideCompatiblesTabContentProps) => {
  const [aidesCompatibles, setAidesCompatibles] = useState<ViewAideEvalueeDto[]>(initialAidesCompatibles);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredAidesCompatibles, setFilteredAidesCompatibles] = useState<ViewAideEvalueeDto[]>(aidesCompatibles);
  const [atAidType, setAtAidType] = useState<AtAidType>();
  useMountEffect(() => {
    let ignoreActionResult = false;
    async function triggerNouvelleRecherche() {
      setLoading(true);
      // The `response` is updated regularly with newly scored `Aide`.
      const response = await rechercherAidesProjetAction(translator.toUUID(projetSuuid));
      for await (const aideCompatible of readStreamableValue<ViewAideEvalueeDto>(response)) {
        if (ignoreActionResult) {
          continue;
        }

        if (aideCompatible) {
          setAidesCompatibles((previousAidesCompatibles) => {
            if (!previousAidesCompatibles.find(({ aide: { id } }) => id === aideCompatible.aide.id)) {
              return previousAidesCompatibles.concat(aideCompatible);
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

  useEffect(() => {
    setFilteredAidesCompatibles(() =>
      aidesCompatibles
        .sort(AideScore.compare)
        .filter(({ aide: { types } }: ViewAideEvalueeDto) =>
          atAidType ? (types || []).map(({ name }) => name).includes(atAidType) : true
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
      <Grid item xs={6}>
        <Tooltip kind="hover" title={'Cette fonctionnalité a été désactivée.'}>
          <Button
            onClick={() =>
              push(['trackEvent', 'reformuler', 'click sur le bouton de reformulation', translator.toUUID(projetSuuid)])
            }
            priority="primary"
            size="large"
            disabled={true}
          >
            Préciser mon projet{'\u00A0'}
            <SearchIcon />
          </Button>
        </Tooltip>
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
