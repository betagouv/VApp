import { type Metadata } from 'next';

const description = 'Identifier les aides éligibles à un projet de collectivité.';

export const sharedMetadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: {
    template: `%s - ${process.env.NEXT_PUBLIC_APP_NAME} - beta.gouv.fr`,
    default: process.env.NEXT_PUBLIC_APP_NAME
  },
  applicationName: process.env.NEXT_PUBLIC_APP_NAME || '',
  description,
  openGraph: {
    title: {
      template: `${process.env.NEXT_PUBLIC_APP_NAME} - %s - beta.gouv.fr`,
      default: process.env.NEXT_PUBLIC_APP_NAME
    },
    description,
    type: 'website',
    locale: 'fr_FR',
    countryName: 'France',
    siteName: process.env.NEXT_PUBLIC_APP_NAME || '',
    images: []
  },
  alternates: {
    canonical: './'
  }
};
