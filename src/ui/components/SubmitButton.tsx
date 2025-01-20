import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';

export type SubmitButtonProps = PropsWithChildren<{ loading?: boolean; error?: boolean }>;

export function SubmitButton({ children, loading = false, error }: SubmitButtonProps) {
  const { pending: submitting } = useFormStatus();

  return (
    <Button
      type="submit"
      onClick={function noRefCheck() {}}
      aria-disabled={submitting || loading || error}
      disabled={submitting || loading || error}
    >
      {children}
      {'\u00A0'}
      {submitting ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
    </Button>
  );
}
