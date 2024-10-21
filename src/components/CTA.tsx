'use client';

import { push } from '@socialgouv/matomo-next';
import { type PropsWithChildren } from 'react';

import { matomoCategory } from '@/infra/matomo/matomo-events';
import { Button } from '@codegouvfr/react-dsfr/Button';

export interface CTAProps {
  href?: string;
}
export const CTA = ({ children, href }: PropsWithChildren<CTAProps>) => {
  const onClick = () => push(['trackEvent', matomoCategory.accueil, 'Click CTA']);
  return (
    <Button
      linkProps={{
        onClick,
        href: href as never
      }}
    >
      {children}
    </Button>
  );
};
