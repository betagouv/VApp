'use client';

import * as React from 'react';
import { Grid } from '@mui/material';

import { AideEligibleCard } from '@/components/AideEligibleCard';
import { ViewAideEligible } from '@/presentation/dtos/view-aide-eligible';

export type AidesEligiblesProps = {
  aidesEligibles: ViewAideEligible[];
};

export const AidesEligibles = ({ aidesEligibles }: AidesEligiblesProps) => {
  return aidesEligibles.map(({ eligibilite, aide }) => (
    <Grid item xs={12} md={6} lg={6} xl={4} key={`aide_${aide.uuid}`}>
      <AideEligibleCard aide={aide} eligibilite={eligibilite} />
    </Grid>
  ));
};
