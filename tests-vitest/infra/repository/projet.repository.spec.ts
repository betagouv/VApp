import { it, describe, beforeAll, afterEach, afterAll } from 'vitest';
import { sql } from 'kysely';
import { db } from '../../../src/infra/database';
import { projetRepository } from '../../../src/infra/repositories/projet.repository';

describe('ProjetRepository', () => {
  beforeAll(async () => {
    await db.schema
      .createTable('projet')
      .addColumn('id', 'serial', (cb) => cb.primaryKey())
      .addColumn('uuid', 'varchar', (cb) => cb.notNull())
      .addColumn('description', 'varchar', (cb) => cb.notNull())
      .addColumn('created_at', 'timestamp', (cb) => cb.notNull().defaultTo(sql`now()`))
      .execute();
  });

  afterEach(async () => {
    await sql`truncate table ${sql.table('projet')}`.execute(db);
  });

  afterAll(async () => {
    await db.schema.dropTable('projet').execute();
  });

  it('should create a projet and find it back', async () => {
    const uuid = await projetRepository.create('lorem ipsum dolor sit amet');
    const projets = await db.selectFrom('projet').select(['projet.uuid', 'projet.description']).execute();
    await projetRepository.getByUuid(uuid);
  });
});
