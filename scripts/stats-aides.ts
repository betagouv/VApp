import './loadEnv';
import { aideRepository, getNbTokenRange } from '@/infra/repositories/aide.repository';
import { OrganizationType } from '@/infra/at/organization-type';

(async () => {
  const nbToken = getNbTokenRange();
  console.log(`Nombres d'aides gratuites applicables entre ${nbToken[0]} et ${nbToken[1]} tokens:`);
  for (const slug of Object.keys(OrganizationType)) {
    const aides = await aideRepository.findAllFor({ beneficiaire: slug, payante: true });
    console.log(`- ${slug}: ${aides.length}`);

    const aidesAvecTerritoire = await aideRepository.findAllFor({
      beneficiaire: slug,
      territoireId: '98585-villeurbanne',
      payante: false
    });
    console.log(`- plus territoire: ${aidesAvecTerritoire.length}`);
  }
})();
