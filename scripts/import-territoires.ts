import './loadEnv';
import { atApiClient } from '@/infra/at/api-client';
import { territoireRepository } from '@/infra/repositories/territoire.repository';

const importTerritoires = async () => {
  const perimeters = await atApiClient.fetchAllPerimeters();
  for (const perimeter of perimeters) {
    await territoireRepository.addFromPerimeter(perimeter);
  }
};

(async () => {
  await importTerritoires();
})();
