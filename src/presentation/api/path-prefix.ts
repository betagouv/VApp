export const pathPrefix = '/api/v1';

export const getApiBaseUrl = () => {
  return new URL(`${pathPrefix}`, process.env.NEXT_PUBLIC_SITE_URL);
};
