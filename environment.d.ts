declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_TELEMETRY_DISABLED: number;
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
      NEXT_PUBLIC_SENTRY_ENV: string;
      NEXT_PUBLIC_MATOMO_URL: string;
      NEXT_PUBLIC_MATOMO_SITE_ID: string;
      NEXT_PUBLIC_APP_REPOSITORY_URL: string;
      NEXT_PUBLIC_BASE_PATH: string;
      REACT_EDITOR: string;
      VERCEL_ENV: 'development' | 'production';

      AT_API_JWT: string;
      DATABASE_URL: string;
      OLLAMA_HOST: string;
      OLLAMA_JWT: string;

      AIDE_DESCRIPTION_MIN_TOKEN: number;
      AIDE_DESCRIPTION_MAX_TOKEN: number;
      NB_AIDE_HARD_LIMIT: number;
    }
  }
}

export {};
