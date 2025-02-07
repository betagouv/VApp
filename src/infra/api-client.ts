import ky from 'ky';

export const apiClient = ky.extend({
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('X-Requested-With', 'VApp');
      }
    ]
  }
});
