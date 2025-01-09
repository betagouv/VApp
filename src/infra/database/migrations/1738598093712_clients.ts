import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('client_table')
    .addColumn('id', 'uuid', (col) => col.notNull().primaryKey())
    .addColumn('nom', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('hashed_secret', 'varchar(255)', (col) => col.notNull())
    .addColumn('salt', 'varchar(255)', (col) => col.notNull())
    .addColumn('iterations', 'smallint', (col) => col.notNull())
    .addColumn('active', 'boolean', (col) => col.notNull().defaultTo(true))
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema.alterTable('projet_table').addColumn('client_id', 'uuid').execute();

  await db.schema
    .alterTable('projet_table')
    .addForeignKeyConstraint('projet_client_id', ['client_id'], 'client_table', ['id'])
    .onDelete('set null')
    .onUpdate('cascade')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet_table').dropConstraint('projet_client_id').execute();
  await db.schema.dropTable('client_table').execute();
  await db.schema.alterTable('projet_table').dropColumn('client_id').execute();
}
