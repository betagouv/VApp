import DsfrHeader from '@codegouvfr/react-dsfr/Header';
import { cx } from '@codegouvfr/react-dsfr/tools/cx';

import { config } from '@/config';

export const Header = () => {
  return (
    <DsfrHeader
      brandTop={
        <>
          République <br />
          Française
        </>
      }
      homeLinkProps={{
        href: '/',
        title: `Accueil - ${config.name}`
      }}
      operatorLogo={{
        alt: "Logo de l'opérateur",
        imgUrl: '/img/ademe.svg',
        orientation: 'vertical'
      }}
      serviceTitle={
        <>
          <span className={cx('ml-2')}>{config.name}</span>
        </>
      }
    />
  );
};
