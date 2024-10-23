import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('projet')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('uuid', 'varchar(36)', (col) => col.notNull().unique())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema.createIndex('projet_uuid').on('projet').column('uuid').execute();

  await db.schema
    .createTable('agent')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('uuid', 'varchar(36)', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('projet').execute();
  await db.schema.dropTable('agent').execute();
}
