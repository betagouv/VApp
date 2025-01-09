import { useEffect, useState } from 'react';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { Projet } from '@/domain/models/projet';
import { Aide } from '@/domain/models/aide';

export function useRecommendationsAvecAides(projet: Projet) {
  const [recommendationsAvecAides, setRecommendationsAvecAides] = useState<
    { scoreCompatibilite: number; aide: Aide }[]
  >([]);

  useEffect(() => {
    const handleProjetChange = async (projet: Projet) => {
      const localRecommendationsAvecAides = await Promise.all(
        projet.getSortedAideScores().map(async ({ aideId, scoreCompatibilite }) => ({
          scoreCompatibilite: scoreCompatibilite,
          aide: await aideRepository.fromUuid(aideId)
        }))
      );
      setRecommendationsAvecAides(localRecommendationsAvecAides);
    };

    handleProjetChange(projet).catch(console.error);
  }, [projet]);

  return recommendationsAvecAides;
}
