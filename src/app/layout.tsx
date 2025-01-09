import { type PropsWithChildren, Suspense } from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next';

import MuiDsfrThemeProvider from '@codegouvfr/react-dsfr/mui';
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';

import { Matomo } from '@/presentation/ui/components/matomo/Matomo';
import { StartDsfr } from '@/presentation/ui/components/StartDsfr';

import { defaultColorScheme } from '@/app/defaultColorScheme';
import { sharedMetadata } from '@/app/shared-metadata';

export const metadata: Metadata = sharedMetadata;

type RootLayoutProps = PropsWithChildren;

const RootLayout = ({ children }: RootLayoutProps) => {
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
          ]}
        />
        <Suspense>
          <Matomo
            url={process.env.NEXT_PUBLIC_MATOMO_URL}
            siteId={process.env.NEXT_PUBLIC_MATOMO_SITE_ID}
            env={process.env.NODE_ENV || 'development'}
          />
        </Suspense>
        <script src="https://cdn.jsdelivr.net/npm/@iframe-resizer/child" type="text/javascript" async></script>
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
