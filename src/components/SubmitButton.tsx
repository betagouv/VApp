import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as React from 'react';

export type SubmitButtonProps = PropsWithChildren<{ loading?: boolean }>;

export function SubmitButton({ children, loading = false }: SubmitButtonProps) {
  const { pending: submitting } = useFormStatus();

  return (
    <Button
      type="submit"
      onClick={function noRefCheck() {}}
      aria-disabled={submitting || loading}
      disabled={submitting || loading}
    >
      {children}
      {'\u00A0'}
      {submitting ? <CircularProgress color="inherit" size={20} /> : <SearchIcon />}
    </Button>
  );
}
