import * as React from 'react';
import { SUUID } from 'short-uuid';
import Grid from '@mui/material/Grid';

import { ReformulationForm } from '@/presentation/ui/components/forms/ReformulationForm';
import { projetRepository } from '@/infra/repositories/projet.repository';

export default async function Page({ params: { projet_suuid } }: { params: { projet_suuid: SUUID } }) {
  const projet = await projetRepository.fromSuuid(projet_suuid);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'center'
      }}
    >
      <Grid item xs={8}>
        <ReformulationForm projet={{ ...projet, suuid: projet.suuid }} />
      </Grid>
    </Grid>
  );
}
