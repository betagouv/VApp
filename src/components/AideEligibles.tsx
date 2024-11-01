import * as React from 'react';
import { Grid } from '@mui/material';
import { AideEligibleCard } from '@/components/AideEligibleCard';
import { AideEligible } from '@/domain/models/aide-eligible';
import { Aide } from '@/domain/models/aide';

export type ViewAideEligible = Pick<AideEligible, 'eligibilite'> & { aide: Aide };

export type AidesEligiblesProps = {
  aidesEligibles: ViewAideEligible[];
};

export const AidesEligibles = ({ aidesEligibles }: AidesEligiblesProps) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h2>Liste des dispositifs d'aides correspondants au projet</h2>
      </Grid>
      <Grid item xs={12}>
        <p>Choisissez une aide pour que nous vous aidions a préciser votre projet.</p>
      </Grid>
      {aidesEligibles.map(({ eligibilite, aide }) => (
        <Grid item xs={12} md={6} lg={6} xl={4} key={`aide_${aide.uuid}`}>
          <AideEligibleCard aide={aide} eligibilite={eligibilite} />
        </Grid>
      ))}
    </Grid>
  );
};
