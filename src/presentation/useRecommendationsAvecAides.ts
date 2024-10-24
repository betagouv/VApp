import { Projet } from '@/domain/models/projet';
import { useEffect, useState } from 'react';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { Aide } from '@/domain/models/aide';

export function useRecommendationsAvecAides(projet: Projet) {
  const [recommendationsAvecAides, setRecommendationsAvecAides] = useState<{ eligibilite: number; aide: Aide }[]>([]);

  useEffect(() => {
    const handleProjetChange = async (projet: Projet) => {
      const aides = await Promise.all(projet.recommendations.map(({ aideId }) => aideRepository.fromUuid(aideId)));
      const localRecommendationsAvecAides = projet.recommendations.map(({ eligibilite }, index) => ({
        eligibilite,
        aide: aides[index]
      }));
      setRecommendationsAvecAides(localRecommendationsAvecAides);
    };

    handleProjetChange(projet).catch(console.error);
  }, [projet]);

  return recommendationsAvecAides;
}
