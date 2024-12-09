import * as React from 'react';
import { SUUID } from 'short-uuid';
import Grid from '@mui/material/Grid';

import { ReformulationForm } from '@/components/forms/ReformulationForm';
import { projetRepository } from '@/infra/repositories/projet.repository';

export default async function Page({ params: { projet_uuid } }: { params: { projet_uuid: SUUID } }) {
  const projet = await projetRepository.fromUuid(projet_uuid);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        justifyContent: 'center'
      }}
    >
      <Grid item xs={8}>
        <ReformulationForm projet={{ ...projet }} />
      </Grid>
    </Grid>
  );
}
