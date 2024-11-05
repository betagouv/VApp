import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('aide_table')
    .addColumn('token_numb_description', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('token_numb_eligibility', 'integer', (col) => col.defaultTo(0).notNull())
    .addColumn('perimeter', 'varchar(255)')
    .addColumn('perimeter_scale', 'varchar(255)')
    .addColumn('financers', 'jsonb', (col) => col.defaultTo('[]').notNull())
    .addColumn('financers_full', 'jsonb', (col) => col.defaultTo('[]').notNull())
    .alterColumn('description', (col) => col.dropNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('aide_table')
    .dropColumn('token_numb_description')
    .dropColumn('token_numb_eligibility')
    .dropColumn('perimeter')
    .dropColumn('perimeter_scale')
    .dropColumn('financers')
    .dropColumn('financers_full')
    .alterColumn('description', (col) => col.setNotNull())
    .execute();
}
