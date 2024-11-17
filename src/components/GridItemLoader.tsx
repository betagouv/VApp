import * as React from 'react';
import { Grid } from '@mui/material';
import { Loader } from '@/components/Loader';

export const GridItemLoader = ({ loading = true, size = 20 }) => {
  if (!loading) {
    return null;
  }

  return (
    <Grid item xs={12}>
      <Loader size={size} />
    </Grid>
  );
};
