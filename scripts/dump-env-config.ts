import 'scripts/load-env-config';

(async () => {
  console.log(process.env.NODE_ENV);
  console.log(process.env.DATABASE_URL);
  console.log(process.env.AT_API_JWT);
})();
