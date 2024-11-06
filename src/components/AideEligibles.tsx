import * as React from 'react';
import { Grid } from '@mui/material';
import Alert from '@codegouvfr/react-dsfr/Alert';
import { Button } from '@codegouvfr/react-dsfr/Button';
import SearchIcon from '@mui/icons-material/Search';

import { AideEligibleCard } from '@/components/AideEligibleCard';
import { AideEligible } from '@/domain/models/aide-eligible';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';

export type ViewAideEligible = Pick<AideEligible, 'eligibilite'> & { aide: Aide };

export type AidesEligiblesProps = {
  aidesEligibles: ViewAideEligible[];
  projet: Pick<Projet, 'uuid'>;
};

export const AidesEligibles = ({ aidesEligibles, projet }: AidesEligiblesProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {aidesEligibles.length > 0 && (
          <Alert
            closable
            title={`Voici les ${aidesEligibles.length} dispositifs d’aide qui correspondraient le mieux à votre projet`}
            description="Précisez votre projet pour affiner les recommandations"
            severity="info"
            small
          />
        )}
      </Grid>
      <Grid item xs={12}>
        <Button
          linkProps={{
            href: `/projets/${projet.uuid}/questions`
          }}
          priority="primary"
          size="large"
        >
          Préciser mon projet{'\u00A0'}
          <SearchIcon />
        </Button>
      </Grid>
      {aidesEligibles.map(({ eligibilite, aide }) => (
        <Grid item xs={12} md={6} lg={6} xl={4} key={`aide_${aide.uuid}`}>
          <AideEligibleCard aide={aide} eligibilite={eligibilite} />
        </Grid>
      ))}
    </Grid>
  );
};
