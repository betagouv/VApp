#!/usr/bin/env node
import 'scripts/load-env-config';
import { lesCommunsApiClient } from '@/infra/les-communs/api-client';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { clientRepository } from '@/infra/repositories/client.repository';
import { projetMapper } from '@/container';

async function importProjetsCommuns() {
  try {
    const client = await clientRepository.fromNom('LesCommuns');
    const projectsDtos = await lesCommunsApiClient.getProjects();
    for (const projectDto of projectsDtos) {
      const projet = await projetMapper.fromLesCommunsProjectDto(projectDto);
      projet.clientId = client.id;
      await projetRepository.add(projet);
    }

    console.log(`Imported "${projectsDtos.length}" projets from Les Communs.`);
  } catch (e) {
    console.dir(e, { depth: null });
    process.exit(1);
  }
}

importProjetsCommuns();
