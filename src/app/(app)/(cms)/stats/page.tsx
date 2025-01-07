import { type Metadata } from 'next';

import { H1 } from '@/components/dsfr/base/typography';
import { sharedMetadata } from '@/app/shared-metadata';
import { StatsContent } from '@/app/(app)/(cms)/stats/content';

const title = "Statistiques d'utilisation";
const description = "Statistiques d'utilisation de la plateforme";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    ...sharedMetadata.openGraph,
    title,
    description
  }
};

const Stats = () => (
  <div className="my-8">
    <H1>{title}</H1>
    <StatsContent />
  </div>
);

export default Stats;
