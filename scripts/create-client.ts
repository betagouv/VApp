#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import 'scripts/load-env-config';
import { clientRepository } from '@/infra/repositories/client.repository';
import { Client } from '@/domain/models/client';
import { generateSecret } from '@/presentation/api/security';
import { getApiBaseUrl } from '@/presentation/api/path-prefix';

async function createClient(nom: string) {
  try {
    const secret = generateSecret();
    const client = await Client.fromSecretAndNom(secret, nom);
    await clientRepository.add(client);

    console.log(`${process.env.NEXT_PUBLIC_APP_NAME} ${process.env.NODE_ENV} API Key for "${client.nom}":`);
    const apiKey = client.createApiKey(secret);
    console.log(apiKey);

    console.log(`API base URL:
${getApiBaseUrl()}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <nom>')
  .demandCommand(1, 'You must provide a client name.')
  .help()
  .parse();

// @ts-expect-error probably an issue with the lib typings
const [nom] = argv._;

createClient(nom);
