import { loadEnvConfig } from '@next/env';
import { parse } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { readFileSync } from 'file-system-cache/lib/common/Util';

const dir = process.cwd();

// @ts-expect-error staging is non standard environment
if (process.env.NODE_ENV === 'staging') {
  const envFile = path.join(dir, '.env.staging.local');
  console.log(`Loading ${envFile}`);
  const stats = fs.statSync(envFile);
  if (stats.isFile()) {
    const config = parse(readFileSync(envFile) || '');
    Object.assign(process.env, config);
  }
}

loadEnvConfig(dir, process.env.NODE_ENV === 'development');
