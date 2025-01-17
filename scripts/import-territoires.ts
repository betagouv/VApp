import './loadEnv';
import { atApiClient } from '@/infra/at/api-client';
import { territoireRepository } from '@/infra/repositories/territoire.repository';
import { msToMinutesAndSeconds } from '@/libs/utils/time';

const importTerritoires = async () => {
  const perimeters = await atApiClient.fetchAllPerimeters();
  for (const perimeter of perimeters) {
    await territoireRepository.addFromPerimeter(perimeter);
  }
};

(async () => {
  try {
    performance.mark('importTerritoiresStarted');
    await importTerritoires();
  } catch (error) {
    console.error(error);
  } finally {
    performance.mark('importTerritoiresFinished');
    performance.measure('importTerritoiresDuration', 'importTerritoiresStarted', 'importTerritoiresFinished');
    console.log(
      `L'import des territoires s'est terminé en ${msToMinutesAndSeconds(performance.getEntriesByName('importTerritoiresDuration')[0].duration)}`
    );
  }
})();
