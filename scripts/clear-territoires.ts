import './loadEnv';
import { sql } from 'kysely';
import { db } from '@/infra/database';

(async () => {
  await sql`truncate table ${sql.table('at_perimeter_table')}`.execute(db);
})();
