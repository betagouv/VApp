import ButtonsGroup from '@codegouvfr/react-dsfr/ButtonsGroup';
import artworkOvoidSvgUrl from '@codegouvfr/react-dsfr/dsfr/artwork/background/ovoid.svg';
import artworkTechnicalErrorSvgUrl from '@codegouvfr/react-dsfr/dsfr/artwork/pictograms/system/technical-error.svg';
import { type StaticImageData } from 'next/image';
import { type ReactNode } from 'react';
import Grid from '@mui/material/Grid';

const errors = {
  '404': {
    title: 'Page non trouvée',
    headline: 'La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.',
    body: (
      <>
        Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n’est peut-être plus
        disponible.
      </>
    )
  },
  '500': {
    title: 'Erreur inattendue',
    headline:
      'Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.',
    body: <>Essayez de rafraichir la page ou bien réessayez plus tard.</>
  },
  construction: {
    title: 'En construction',
    headline: 'Ce service est en cours de construction.',
    body: <>Nous travaillons pour le rendre disponible le plus rapidement possible.</>
  },
  maintenance: {
    title: 'Maintenance',
    headline: 'Le service est actuellement en maintenance.',
    body: <>Nous travaillons pour le rétablir le plus rapidement possible.</>
  }
};

export type ErrorDisplayProps = {
  noRedirect?: boolean;
} & (
  | {
      body: ReactNode;
      code: 'custom';
      headline: string;
      title: string;
    }
  | {
      body?: never;
      code: keyof typeof errors;
      headline?: never;
      title?: never;
    }
);

export const ErrorDisplay = ({ code, noRedirect, body, headline, title }: ErrorDisplayProps) => {
  if (code !== 'custom') {
    if (!errors[code]) throw new Error(`Unknown error code: ${code}`);
    ({ body, headline, title } = errors[code]);
  }

  return (
    <Grid>
      <Grid item xs={8}>
        <h1>{title}</h1>
        {!isNaN(+code) && <p>Erreur {code}</p>}
        <p>{headline}</p>
        <p>{body}</p>
        {!noRedirect && (
          <ButtonsGroup
            inlineLayoutWhen="md and up"
            buttons={[
              {
                children: "Page d'accueil",
                linkProps: {
                  href: '/'
                }
              }
            ]}
          />
        )}
      </Grid>
      <Grid item xs={4}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="fr-responsive-img fr-artwork"
          aria-hidden="true"
          width="160"
          height="200"
          viewBox="0 0 160 200"
        >
          <use className="fr-artwork-motif" href={`${(artworkOvoidSvgUrl as StaticImageData).src}#artwork-motif`}></use>
          <use
            className="fr-artwork-background"
            href={`${(artworkOvoidSvgUrl as StaticImageData).src}#artwork-background`}
          ></use>
          <g transform="translate(40, 60)">
            <use
              className="fr-artwork-decorative"
              href={`${(artworkTechnicalErrorSvgUrl as StaticImageData).src}#artwork-decorative`}
            ></use>
            <use
              className="fr-artwork-minor"
              href={`${(artworkTechnicalErrorSvgUrl as StaticImageData).src}#artwork-minor`}
            ></use>
            <use
              className="fr-artwork-major"
              href={`${(artworkTechnicalErrorSvgUrl as StaticImageData).src}#artwork-major`}
            ></use>
          </g>
        </svg>
      </Grid>
    </Grid>
  );
};
