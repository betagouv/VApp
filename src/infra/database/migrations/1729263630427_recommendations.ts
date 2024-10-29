import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projet')
    .addColumn('recommendations', 'jsonb', (col) => col.defaultTo('[]').notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet').dropColumn('recommendations').execute();
}
