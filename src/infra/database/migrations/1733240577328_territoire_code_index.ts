import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('at_perimeter_table')
    .addUniqueConstraint('unique_perimeter_code_with_scale', ['code', 'scale'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('at_perimeter_table').dropConstraint('unique_perimeter_code_with_scale').execute();
}
