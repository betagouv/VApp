import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('aide_table')
    .addColumn('criteres_eligibilite', 'text')
    .addColumn('url', 'varchar(255)', (col) => col.notNull())
    .addColumn('targeted_audiences', 'jsonb', (col) => col.defaultTo('[]').notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('aide_table')
    .dropColumn('criteres_eligibilite')
    .dropColumn('url')
    .dropColumn('targeted_audiences')
    .execute();
}
