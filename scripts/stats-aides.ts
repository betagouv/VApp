import './loadEnv';
import { aideRepository } from '@/infra/repositories/aide.repository';
import audiences from '../data/targeted-audiences.json';

(async () => {
  console.log("Nombres d'aides applicables par audience:");
  for (let i = 0; i < audiences.length; i++) {
    const aides = await aideRepository.findAllForAudience(audiences[i]);
    console.log(`- ${audiences[i]}: ${aides.length}`);
  }
})();
