import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from './types';
import * as url from 'node:url';

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL');
}
const params = url.parse(process.env.DATABASE_URL);

if (!params.auth) {
  throw new Error('Missing `user:password` in DATABASE_URL');
}
const auth = params.auth.split(':');

if (!params.pathname) {
  throw new Error('Missing `database` name in DATABASE_URL');
}

if (!params.hostname) {
  throw new Error('Missing `host` name in DATABASE_URL');
}

const dialect = new PostgresDialect({
  pool: new Pool({
    user: auth[0],
    password: auth[1],
    database: params.pathname.split('/')[1],
    host: params.hostname,
    port: params.port ? Number(params.port) : 5432,
    max: 10
  })
});

// DB interface is passed to Kysely's constructor.
// Dialect is passed to Kysely's constructor.
export const db = new Kysely<DB>({
  dialect
});
