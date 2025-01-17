'use client';

import { startReactDsfr } from '@codegouvfr/react-dsfr/next-appdir';
import Link from 'next/link';

import { defaultColorScheme } from '@/app/defaultColorScheme';

declare module '@codegouvfr/react-dsfr/next-appdir' {
  interface RegisterLink {
    Link: typeof Link;
  }
}

startReactDsfr({ defaultColorScheme, Link });

export function StartDsfr() {
  return null;
}
