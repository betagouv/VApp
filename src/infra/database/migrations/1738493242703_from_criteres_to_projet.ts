import { Kysely, sql } from 'kysely';
import { atOrganizationTypeLabels, AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import short from 'short-uuid';

const translator = short();

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projet_table').renameColumn('uuid', 'suuid').execute();
  await db.schema.alterTable('projet_table').addUniqueConstraint('unique_projet_suuid', ['suuid']).execute();

  await db.schema
    .alterTable('projet_table')
    .addColumn('porteur', 'varchar(255)')
    .addColumn('etat_avancement', 'varchar(255)')
    .addColumn('uuid', 'uuid', (col) => col.unique())
    .execute();

  const rows = await db.selectFrom('projet_table').selectAll().execute();
  for (const row of rows) {
    const suuid = row.suuid;
    const uuid = translator.toUUID(suuid);
    await db.updateTable('projet_table').set({ uuid: uuid }).where('suuid', '=', row.suuid).execute();
  }

  // porteur
  await db
    .updateTable('projet_table')
    .set('porteur', atOrganizationTypeLabels[AtOrganizationTypeSlug.Commune])
    .execute();
  await db
    .updateTable('projet_table')
    .set('porteur', sql`criteres_recherche_aide->>'beneficiaire'`)
    // @ts-expect-error raw sql statement
    .where(sql`criteres_recherche_aide ? 'beneficiaire'`)
    // @ts-expect-error raw sql statement
    .where(sql`criteres_recherche_aide->>'beneficiaire' != ''`)
    .execute();
  await db.schema
    .alterTable('projet_table')
    .alterColumn('porteur', (col) => col.setNotNull())
    .execute();

  // zone geo
  await db.schema
    .createTable('projet_zone_geographique_table')
    .addColumn('projet_uuid', 'uuid', (col) => col.notNull())
    .addColumn('at_perimeter_id', 'varchar(255)', (col) => col.notNull())
    .addPrimaryKeyConstraint('primary_key', ['projet_uuid', 'at_perimeter_id'])
    .execute();

  await db.schema
    .alterTable('projet_zone_geographique_table')
    .addForeignKeyConstraint('projet_zone_geographique_projet_uuid', ['projet_uuid'], 'projet_table', ['uuid'])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();
  await db.schema
    .alterTable('projet_zone_geographique_table')
    .addForeignKeyConstraint('projet_zone_geographique_at_perimeter_id', ['at_perimeter_id'], 'at_perimeter_table', [
      'id'
    ])
    .onDelete('cascade')
    .onUpdate('cascade')
    .execute();

  await db
    .insertInto('projet_zone_geographique_table')
    .columns(['projet_uuid', 'at_perimeter_id'])
    .expression((qb) =>
      qb
        .selectFrom('projet_table')
        .select(['uuid as projet_uuid', 'at_perimeter_id'])
        .where('at_perimeter_id', 'is not', null)
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('projet_zone_geographique_table').execute();

  await db.schema
    .alterTable('projet_table')
    .dropColumn('porteur')
    .dropColumn('etat_avancement')
    .dropColumn('uuid')
    .execute();

  await db.schema.alterTable('projet_table').dropConstraint('unique_projet_suuid').execute();

  await db.schema.alterTable('projet_table').renameColumn('suuid', 'uuid').execute();
}
