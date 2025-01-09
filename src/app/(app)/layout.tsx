import { type PropsWithChildren } from 'react';
import { SkipLinks } from '@codegouvfr/react-dsfr/SkipLinks';
import { fr } from '@codegouvfr/react-dsfr';
import { headerFooterDisplayItem } from '@codegouvfr/react-dsfr/Display';
import { Header } from '@codegouvfr/react-dsfr/Header';
import Badge from '@codegouvfr/react-dsfr/Badge';
import { Footer } from '@codegouvfr/react-dsfr/Footer';

import { ConsentBannerAndConsentManagement } from '@/presentation/ui/components/consentManagement';
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
      href: `${process.env.NEXT_PUBLIC_APP_REPOSITORY_URL}`
    }
  }
];

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
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
        serviceTitle={
          <>
            VApp{' '}
            <Badge as="span" noIcon severity="success">
              Beta
            </Badge>
          </>
        }
        serviceTagline="Le service numérique qui vous aide à trouver des aides pour vos projets"
        homeLinkProps={homeLinkPops}
        navigation={[]}
        quickAccessItems={[
          {
            iconId: 'fr-icon-add-line',
            text: 'Nouveau projet',
            linkProps: {
              href: '/nouvelle-recherche'
            }
          },
          {
            iconId: 'fr-icon-chat-3-line',
            text: 'Retours utilisateurs',
            linkProps: {
              href: 'https://airtable.com/appymQfRFTofaHYrg/shryZG0t2LqzCEiBH'
            }
          },
          headerFooterDisplayItem
        ]}
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
    </>
  );
};

export default AppLayout;
