import ky from 'ky';
import * as Sentry from '@sentry/nextjs';

export const fetch = ky.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('X-Requested-With', 'VApp');
      }
    ],
    beforeError: [
      (error) => {
        Sentry.captureException(error);
        return error;
      }
    ]
  }
});
