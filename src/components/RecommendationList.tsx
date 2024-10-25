import * as React from 'react';
import { AideEligible } from '@/domain/models/aide-eligible';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

function getColor(value: number) {
  console.assert(value >= 0 && value <= 1);
  const hue = (value * 120).toString(10);
  return ['hsl(', hue, ',100%,50%)'].join('');
}

export type RecommendationListProps = {
  aidesEligibles: AideEligible[];
};

export const RecommendationList = async ({ aidesEligibles }: RecommendationListProps) => {
  return (
    <RadioButtons
      legend="Liste des dispositifs d'aides correspondants au projet"
      name="radio"
      options={aidesEligibles.map(({ eligibilite, aide }) => ({
        illustration: (
          <Tooltip title="Score d'éligibilité" kind="hover">
            <span style={{ backgroundColor: getColor((eligibilite * 25) / 100) }}>{eligibilite * 25}%</span>
          </Tooltip>
        ),
        label: aide.nom,
        nativeInputProps: {
          value: aide.uuid
        },
        hintText: (aide.description || '').slice(0, 256).concat('...')
      }))}
      state="default"
      stateRelatedMessage="Choisissez une aide pour que nous vous aidions a préciser votre projet."
    />
  );
};
