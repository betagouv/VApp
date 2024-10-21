import { type Metadata } from 'next';

import { H1 } from '@/components/dsfr/base/typography';

import { sharedMetadata } from '../shared-metadata';
import { StatsContent } from './content';

const title = "Statistiques d'utilisation";
const description = "Statistiques d'utilisation de la plateforme";
const url = '/stats';

export const metadata: Metadata = {
  ...sharedMetadata,
  title,
  description,
  openGraph: {
    ...sharedMetadata.openGraph,
    title,
    description,
    url
  },
  alternates: {
    canonical: url
  }
};

const Stats = () => (
  <div className="my-8">
    <H1>{title}</H1>
    <StatsContent />
  </div>
);

export default Stats;
