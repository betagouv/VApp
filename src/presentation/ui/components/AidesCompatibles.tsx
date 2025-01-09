'use client';

import * as React from 'react';
import { Grid } from '@mui/material';

import { AideCompatibleCard } from '@/presentation/ui/components/AideCompatibleCard';
import { ViewAideCompatibleDto } from '@/presentation/ui/dtos/view-aide-compatible.dto';

export type AidesCompatiblesProps = {
  aidesCompatibles: ViewAideCompatibleDto[];
};

export const AidesCompatibles = ({ aidesCompatibles }: AidesCompatiblesProps) => {
  return aidesCompatibles.map(({ scoreCompatibilite, aide }) => (
    <Grid item xs={12} md={6} lg={6} xl={4} key={`aide_${aide.uuid}`}>
      <AideCompatibleCard aide={aide} compatibilite={scoreCompatibilite} />
    </Grid>
  ));
};
