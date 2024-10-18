import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet').renameTo('projet_table').execute();
  await db.schema.alterTable('agent').renameTo('agent_table').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet_table').renameTo('projet').execute();

  await db.schema.alterTable('agent_table').renameTo('agent').execute();
}
