import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('aide_table').execute();

  await db.schema
    .createTable('aide_table')

    // new colums
    .addColumn('uuid', 'uuid', (col) => col.defaultTo(sql`gen_random_uuid()`).primaryKey())
    .addColumn('id', 'integer', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('description_md', 'text', (col) => col.notNull())
    .addColumn('eligibility_md', 'text', (col) => col.notNull())
    .addColumn('is_charged', `boolean`, (col) => col.defaultTo(false).notNull())
    .addColumn('destinations', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .addColumn('mobilization_steps', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .addColumn('aid_types', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .addColumn('aid_types_full', 'jsonb', (col) => col.defaultTo('[]').notNull())
    .addColumn('token_numb_description', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('token_numb_eligibility', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('perimeter', 'varchar(255)')
    .addColumn('perimeter_scale', 'varchar(255)')
    .addColumn('url', 'varchar(255)', (col) => col.notNull())
    .addColumn('financers', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .addColumn('financers_full', 'jsonb', (col) => col.defaultTo('[]').notNull())
    .addColumn('targeted_audiences', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.createTable('aide_table').execute();
}
