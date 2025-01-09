import * as React from 'react';
import { CircularProgress } from '@mui/material';

export const Loader = ({ size = 20 }) => {
  return <CircularProgress color="inherit" size={size} />;
};
