import 'scripts/load-env-config';
import { defineConfig } from 'kysely-ctl';
import { db } from '../src/infra/database';

export default defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  kysely: db,
  migrations: {
    migrationFolder: 'src/infra/database/migrations'
  }
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
