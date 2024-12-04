import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('at_perimeter_table').addUniqueConstraint('unique_at_perimeter_id', ['id']).execute();
  await db.schema.alterTable('projet_table').addColumn('at_perimeter_id', 'varchar(255)').execute();
  await db.schema
    .alterTable('projet_table')
    .addForeignKeyConstraint('projet_at_perimeter', ['at_perimeter_id'], 'at_perimeter_table', ['id'])
    .onDelete('set null')
    .onUpdate('cascade')
    .execute();

  await db
    .updateTable('projet_table')
    .set('at_perimeter_id', sql`criteres_recherche_aide->>'territoireId'`)
    // @ts-expect-error raw sql statement
    .where(sql`criteres_recherche_aide ? 'territoireId'`)
    // @ts-expect-error raw sql statement
    .where(sql`criteres_recherche_aide->>'territoireId' != ''`)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet_table').dropColumn('at_perimeter_id').execute();
  await db.schema.alterTable('at_perimeter_table').dropConstraint('unique_at_perimeter_id').execute();
}
