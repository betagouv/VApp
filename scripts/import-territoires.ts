import 'scripts/load-env-config';
import { atApiClient } from '@/infra/at/api-client';
import { atZoneGeographiqueRepository } from '@/infra/repositories/at-zone-geographique.repository';
import { msToMinutesAndSeconds } from '@/libs/time';

const importTerritoires = async () => {
  const perimeters = await atApiClient.fetchAllPerimeters();
  for (const perimeter of perimeters) {
    await atZoneGeographiqueRepository.addFromPerimeter(perimeter);
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
