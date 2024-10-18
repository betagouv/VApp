import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from './types';

const dialect = new PostgresDialect({
  pool: new Pool({
    password: process.env.POSTGRES_PASSWORD || 'example',
    user: process.env.POSTGRES_USER || 'vapp',
    database: process.env.POSTGRES_DB || 'vapp',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    max: 10
  })
});

// DB interface is passed to Kysely's constructor.
// Dialect is passed to Kysely's constructor.
export const db = new Kysely<DB>({
  dialect
});
