import './loadEnv';
import { aideRepository, getNbTokenRange } from '@/infra/repositories/aide.repository';
import { AtOrganizationType } from '@/infra/at/organization-type';
import { Beneficiaire } from '@/domain/models/beneficiaire';

(async () => {
  const nbToken = getNbTokenRange();
  console.log(`Nombres d'aides gratuites applicables entre ${nbToken[0]} et ${nbToken[1]} tokens:`);
  for (const slug of Object.keys(AtOrganizationType)) {
    const aidesAvecTerritoire = await aideRepository.findAllFor({
      beneficiaire: slug as Beneficiaire,
      territoireId: '98585-villeurbanne',
      payante: false
    });
    console.log(`- ${slug} plus territoire: ${aidesAvecTerritoire.length}`);
  }
})();
