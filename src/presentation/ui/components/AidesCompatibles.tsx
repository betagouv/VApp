'use client';

import * as React from 'react';
import { Grid } from '@mui/material';

import { AideCompatibleCard } from '@/presentation/ui/components/AideCompatibleCard';
import { ViewAideEvalueeDto } from '@/presentation/ui/dtos/view-aide-evaluee.dto';

export type AidesCompatiblesProps = {
  aidesCompatibles: ViewAideEvalueeDto[];
};

export const AidesCompatibles = ({ aidesCompatibles }: AidesCompatiblesProps) => {
  return aidesCompatibles.map(({ scoreCompatibilite, aide }) => (
    <Grid item xs={12} md={6} lg={6} xl={4} key={`aide_${aide.id}_${aide.fournisseurDonnees}`}>
      <AideCompatibleCard aide={aide} compatibilite={scoreCompatibilite} />
    </Grid>
  ));
};
