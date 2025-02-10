import { Kysely, sql } from 'kysely';
import { FournisseurDonneesAides } from '@/domain/models/fournisseur-donnees-aides';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('aide_table')
    .addColumn('data_provider', 'varchar(255)', (col) =>
      col.notNull().defaultTo(FournisseurDonneesAides.AideTerritoires)
    )
    .alterColumn('id', (col) => col.setDataType('varchar(255)'))
    .execute();

  await db.schema
    .alterTable('aide_table')
    .addUniqueConstraint('unique_id_per_data_provider', ['id', 'data_provider'])
    .execute();

  await db.schema
    .alterTable('projet_table')
    .addColumn('aides_scores', 'jsonb', (col) => col.defaultTo(sql`'[]'::jsonb`).notNull())
    .execute();

  await sql`
    WITH updated AS (
      SELECT
        p.id AS projet_id,
        jsonb_agg(
          jsonb_build_object(
            'id', COALESCE(a.id, elem->>'aideId'),
            'source', 'AidesTerritoires',
            'score', elem->>'scoreCompatibilite'
          )
        ) AS new_scores
      FROM projet_table p
      CROSS JOIN LATERAL jsonb_array_elements(p.recommendations) AS elem
      LEFT JOIN aide_table a
        ON a.uuid::text = elem->>'aideId'
      GROUP BY p.id
    )
    UPDATE projet_table p
    SET aides_scores = updated.new_scores
    FROM updated
    WHERE p.id = updated.projet_id
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('aide_table').dropConstraint('unique_id_per_data_provider').execute();
  await db.schema.alterTable('aide_table').dropColumn('data_provider').execute();
  await db.schema.alterTable('projet_table').dropColumn('aides_scores').execute();
}
