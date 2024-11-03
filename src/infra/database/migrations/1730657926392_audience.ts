import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet_table').addColumn('audience', 'varchar(255)').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet_table').dropColumn('audience').execute();
}
