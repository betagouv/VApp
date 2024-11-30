import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('aide_table')
    .addColumn('programs', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .addColumn('categories', sql`text[]`, (col) => col.defaultTo(sql`array[]::text[]`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('aide_table').dropColumn('programs').dropColumn('categories').execute();
}
