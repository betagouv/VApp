import './loadEnv';
import { sql } from 'kysely';
import { db } from '@/infra/database';

(async () => {
  await sql`TRUNCATE TABLE ${sql.table('projet_table')} CASCADE`.execute(db);
})();
