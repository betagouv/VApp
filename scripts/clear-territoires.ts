import 'scripts/load-env-config';
import { sql } from 'kysely';
import { db } from '@/infra/database';

(async () => {
  await sql`TRUNCATE TABLE ${sql.table('at_perimeter_table')} CASCADE`.execute(db);
})();
