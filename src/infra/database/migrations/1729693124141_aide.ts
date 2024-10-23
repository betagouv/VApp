import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('aide_table')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('aides_territoire_id', 'integer', (col) => col.notNull().unique())
    .addColumn('uuid', 'varchar(36)', (col) => col.notNull().unique())
    .addColumn('nom', 'varchar(255)', (col) => col.defaultTo('[]').notNull())
    .addColumn('description', 'text', (col) => col.defaultTo('[]').notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema.createIndex('aide_uuid').on('aide_table').column('uuid').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('aide_table').execute();
}
