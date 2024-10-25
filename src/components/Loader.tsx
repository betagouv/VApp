import * as React from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { Box } from '@/components/dsfr/base/Box';
import { Grid } from '@/components/dsfr/layout';

export type LoaderProps = {};

export const Loader = async ({}: LoaderProps) => {
  return (
    <Grid flexDirection="column">
      <Stack spacing={2} direction="row">
        <Box>
          <CircularProgress variant="determinate" />
          <Box>
            <Typography variant="caption" component="div" color="text.secondary">
              Chargement
            </Typography>
          </Box>
        </Box>
      </Stack>
      <Typography variant="body1" component="div">
        La recherche peut parfois prendre quelques minutes...
      </Typography>
    </Grid>
  );
};
