export const config = {
  host: process.env.NEXT_PUBLIC_SITE_URL!,
  name: 'VApp',
  env: (process.env.NODE_ENV || 'dev') as 'dev' | 'preprod' | 'prod',
  matomo: {
    siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID!,
    url: process.env.NEXT_PUBLIC_MATOMO_URL!
  },
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION!,
  appVersionCommit: process.env.NEXT_PUBLIC_APP_VERSION_COMMIT!,
  repositoryUrl: process.env.NEXT_PUBLIC_REPOSITORY_URL!,
  storeKey: 'vapp',
  cacheDuration: 1000 * 60 * 60 // 1 heure
};
