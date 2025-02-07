declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_TELEMETRY_DISABLED: number;
      NEXT_PUBLIC_APP_NAME: string;
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_SENTRY_DSN: string;
      NEXT_PUBLIC_SENTRY_ENV: string;
      NEXT_PUBLIC_MATOMO_URL: string;
      NEXT_PUBLIC_MATOMO_SITE_ID: string;
      NEXT_PUBLIC_APP_REPOSITORY_URL: string;
      NEXT_PUBLIC_BASE_PATH: string;

      AT_API_JWT: string;
      LC_API_BASE_URL: string;
      LC_API_BEARER_TOKEN: string;
      DATABASE_URL: string;
      OLLAMA_HOST: string;
      OLLAMA_JWT: string;

      // @deprecated use NOTATION_MAX_SEED instead
      MIN_NB_NOTES_REQUIRED: number;
      NB_AIDE_HARD_LIMIT: number;
      // @deprecated use SCORING_MAX_SEED instead
      NOTATION_MAX_SEED: number;
      SCORING_MAX_SEED: number;

      AIDE_DESCRIPTION_MIN_TOKEN: number;
      AIDE_DESCRIPTION_MAX_TOKEN: number;

      SECRET_PEPPER: string;
      DOCUMENTATION_API_KEY?: string;

      REACT_EDITOR: string;
    }
  }
}

export {};
