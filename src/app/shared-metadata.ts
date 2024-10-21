import { type Metadata } from 'next';

const description = 'Identifier les aides éligibles à un projet de collectivité.';

export const sharedMetadata: Metadata = {
  description,
  openGraph: {
    description,
    type: 'website',
    locale: 'fr_FR',
    countryName: 'France',
    siteName: 'VApp',
    images: []
  }
};
