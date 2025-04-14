import 'scripts/load-env-config';
import fs from 'fs';
import path from 'path';
import { generateOpenApi } from '@/presentation/api/open-api';

async function generateOpenApiSpecFile() {
  try {
    const dir = process.cwd();
    const specFilePath = path.join(dir, 'docs-api/openapi.json');
    fs.writeFileSync(specFilePath, JSON.stringify(generateOpenApi()));
  } catch (e) {
    console.dir(e, { depth: null });
    process.exit(1);
  }
}

generateOpenApiSpecFile();
