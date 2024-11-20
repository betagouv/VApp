import ky from 'ky';

export const api = ky.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('X-Requested-With', 'VApp');
      }
    ]
  }
});
