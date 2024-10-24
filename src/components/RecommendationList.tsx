import * as React from 'react';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import { Projet } from '@/domain/models/projet';
import { aideRepository } from '@/infra/repositories/aide.repository';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

export type RecommendationListProps = {
  projet: Projet;
};

export const RecommendationList = async ({ projet }: RecommendationListProps) => {
  const aides = await Promise.all(projet.recommendations.map(({ aideId }) => aideRepository.fromUuid(aideId)));
  const recommendationsAvecAides = projet.recommendations.map(({ eligibilite }, index) => ({
    eligibilite,
    aide: aides[index]
  }));

  return (
    <RadioButtons
      legend="Légende pour l’ensemble de champs"
      name="radio"
      options={recommendationsAvecAides.map(({ eligibilite, aide }) => ({
        illustration: (
          <Tooltip title="Score d'éligibilité" kind="hover">
            <span>{eligibilite * 25}%</span>
          </Tooltip>
        ),
        label: aide.nom,
        nativeInputProps: {
          value: aide.uuid
        },
        hintText: aide.description
      }))}
      state="default"
      stateRelatedMessage="State description"
    />
  );
};
