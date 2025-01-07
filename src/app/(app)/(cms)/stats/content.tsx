import Card from '@codegouvfr/react-dsfr/Card';
import Grid from '@mui/material/Grid';

import { fetchMatomoData } from '@/infra/matomo/matomo';

export const StatsContent = async () => {
  const matomoData = await fetchMatomoData(process.env.NEXT_PUBLIC_MATOMO_URL, process.env.NEXT_PUBLIC_MATOMO_SITE_ID);

  return (
    <Grid>
      <Grid item md={4}>
        <Card
          title="Nombre de visites"
          desc="Nombre de visites total du site sur les 12 derniers mois"
          start={<strong className="fr-display--md">{matomoData.nbVisits}</strong>}
          size="large"
          grey
        />
      </Grid>
      <Grid md={4}>
        <Card
          title="Nombre de pages vues (total)"
          desc="Nombre de pages vues au total sur le site sur les 12 derniers mois"
          start={<strong className="fr-display--md">{matomoData.nbPageViews}</strong>}
          size="large"
          grey
        />
      </Grid>
      <Grid md={4}>
        <Card
          title="Nombre de pages vues (uniques)"
          desc="Nombre de pages vues uniques sur le site sur les 12 derniers mois"
          start={<strong className="fr-display--md">{matomoData.nbUniqPageViews}</strong>}
          size="large"
          grey
        />
      </Grid>
    </Grid>
  );
};
