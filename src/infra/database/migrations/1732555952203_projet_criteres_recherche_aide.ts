import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

  await db.schema
    .alterTable('projet_table')
    .addColumn('criteres_recherche_aide', 'jsonb', (col) => col.defaultTo('{}').notNull())
    .dropColumn('audience')
    .dropColumn('territoire')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projet_table')
    .addColumn('territoire', 'jsonb')
    .addColumn('audience', 'varchar(255)')
    .execute();
}
