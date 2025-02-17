#!/usr/bin/env node
import 'scripts/load-env-config';
import { generateSecret } from '@/presentation/api/security';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Client } from '@/domain/models/client';
import { clientRepository } from '@/infra/repositories/client.repository';

async function createClient(nom: string) {
  try {
    const secret = generateSecret();
    const client = await Client.fromSecretAndNom(secret, nom);
    await clientRepository.add(client);

    console.log(`You may provide "${client.nom}" with the following API key:`);
    const apiKey = client.createApiKey(secret);
    console.log(apiKey);
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
