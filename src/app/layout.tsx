import { type PropsWithChildren, Suspense } from 'react';
import { type Metadata } from 'next';
import Link from 'next/link';
import { NextAppDirEmotionCacheProvider } from 'tss-react/next';

import MuiDsfrThemeProvider from '@codegouvfr/react-dsfr/mui';
import { DsfrHead } from '@codegouvfr/react-dsfr/next-appdir/DsfrHead';
import { DsfrProvider } from '@codegouvfr/react-dsfr/next-appdir/DsfrProvider';
import { getHtmlAttributes } from '@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes';
import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import { headerFooterDisplayItem } from '@codegouvfr/react-dsfr/Display';
import { Header } from '@codegouvfr/react-dsfr/Header';
import { fr } from '@codegouvfr/react-dsfr';

import { Footer } from '@codegouvfr/react-dsfr/Footer';
import { Matomo } from '@/components/matomo/Matomo';
import { config } from '@/config';
import { ConsentBannerAndConsentManagement } from '@/components/consentManagement';

import { defaultColorScheme } from '../defaultColorScheme';
import { StartDsfr } from 'src/components/StartDsfr';
import { sharedMetadata } from './shared-metadata';
import pkg from 'package.json';

const brandTop = (
  <>
    République
    <br />
    Française
  </>
);

const homeLinkPops = {
  href: '/',
  title: "Accueil - Nom de l’entité (ministère, secrétariat d'état, gouvernement)"
};

const bottomLinks = [
  {
    text: "Conditions d'utilisation",
    linkProps: {
      href: '/cgu'
    }
  },
  {
    text: 'Statistiques',
    linkProps: {
      href: '/stats'
    }
  },
  {
    text: 'Budget',
    linkProps: {
      href: '/budget'
    }
  },
  {
    text: 'Politique de confidentialité',
    linkProps: {
      href: '/politique-confidentialite'
    }
  },
  {
    text: 'Aide',
    linkProps: {
      href: '/aide'
    }
  },
  {
    text: 'Contribuer sur GitHub',
    linkProps: {
      href: `${process.env.NEXT_PUBLIC_APP_REPOSITORY_URL}${
        process.env.NEXT_PUBLIC_APP_VERSION
          ? `/releases/tag/v${process.env.NEXT_PUBLIC_APP_VERSION}`
          : process.env.NEXT_PUBLIC_APP_VERSION_COMMIT
            ? `/commit/${process.env.NEXT_PUBLIC_APP_VERSION}`
            : ''
      }`
    }
  }
];

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

const RootLayout = ({ children }: PropsWithChildren) => {
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
      </head>
      <body>
        <DsfrProvider lang="fr">
          <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
            <MuiDsfrThemeProvider>
              <ConsentBannerAndConsentManagement />
              <SkipLinks
                links={[
                  {
                    anchor: '#fr-header-main-navigation',
                    label: 'Menu'
                  },
                  {
                    anchor: '#content',
                    label: 'Contenu'
                  },
                  {
                    anchor: '#fr-footer',
                    label: 'Pied de page'
                  }
                ]}
              />
              <Header
                brandTop={brandTop}
                serviceTitle="VApp"
                serviceTagline="Le service numérique qui vous aide à trouver des aides pour vos projets"
                homeLinkProps={homeLinkPops}
                navigation={[]}
                quickAccessItems={[headerFooterDisplayItem]}
              />
              <div className={fr.cx('fr-container', 'fr-container--fluid', 'fr-p-5w')} id="content">
                {children}
              </div>
              <Footer
                brandTop={brandTop}
                accessibility="non compliant"
                contentDescription={`
    Ce message est à remplacer par les informations de votre site.

    Comme exemple de contenu, vous pouvez indiquer les informations
    suivantes : Le site officiel d’information administrative pour les entreprises.
                `}
                homeLinkProps={homeLinkPops}
                license={`Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont proposés sous licence ${pkg.license}`}
                accessibilityLinkProps={{ href: '/accessibilite' }}
                termsLinkProps={{ href: '/mentions-legales' }}
                bottomItems={[...bottomLinks, headerFooterDisplayItem]}
              />
            </MuiDsfrThemeProvider>
          </NextAppDirEmotionCacheProvider>
        </DsfrProvider>
      </body>
    </html>
  );
};

export default RootLayout;
