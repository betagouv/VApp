import { type PropsWithChildren, ReactNode, Suspense } from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next';

import MuiDsfrThemeProvider from '@codegouvfr/react-dsfr/mui';
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { Matomo } from '@/components/matomo/Matomo';
import { config } from '@/config';

import { defaultColorScheme } from '@/defaultColorScheme';
import { StartDsfr } from '@/components/StartDsfr';
import { sharedMetadata } from '@/app/shared-metadata';

export const metadata: Metadata = {
  metadataBase: config.host ? new URL(config.host) : undefined,
  ...sharedMetadata,
  title: {
    template: `%s - ${config.name}`,
    default: config.name
  },
  openGraph: {
    title: {
      template: `${config.name} - %s`,
      default: config.name
    },
    ...sharedMetadata.openGraph
  }
};

type RootLayoutProps = PropsWithChildren<{ head?: ReactNode }>;

const RootLayout = ({ children, head }: RootLayoutProps) => {
  return (
    <html lang="fr" {...getHtmlAttributes({ defaultColorScheme, lang: 'fr' })}>
      <head>
        <StartDsfr />
        <DsfrHead
          Link={Link}
          preloadFonts={[
            'Marianne-Light',
            'Marianne-Light_Italic',
            'Marianne-Regular',
            'Marianne-Regular_Italic',
            'Marianne-Medium',
            'Marianne-Medium_Italic',
            'Marianne-Bold',
            'Marianne-Bold_Italic'
            //"Spectral-Regular",
            //"Spectral-ExtraBold"
          ]}
        />

        <Suspense>
          <Matomo env={config.env} />
        </Suspense>
        {head}
      </head>
      <body>
        <DsfrProvider lang="fr">
          <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
            <MuiDsfrThemeProvider>{children}</MuiDsfrThemeProvider>
          </NextAppDirEmotionCacheProvider>
        </DsfrProvider>
      </body>
    </html>
  );
};

export default RootLayout;
