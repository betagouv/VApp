import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

  await db.schema
    .createTable('at_perimeter_table')
    .addColumn('uuid', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('id', 'varchar(255)', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('text', 'text', (col) => col.notNull())
    .addColumn('scale', 'text', (col) => col.notNull())
    .addColumn('zipcodes', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .addColumn('code', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema.createIndex('perimeter_text_autocomplete').on('at_perimeter_table').column('text').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP EXTENSION IF EXISTS "uuid-ossp"`.execute(db);
  await db.schema.dropTable('at_perimeter_table').execute();
}
