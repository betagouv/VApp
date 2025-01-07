import * as React from 'react';

import { ViewAideEligible } from '@/presentation/dtos/view-aide-eligible';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { unique } from '@/libs/utils/array';
import { AtAidType } from '@/infra/at/aid-type';

type DynamicAtAideTypeSelectProps = {
  aidesEligibles: ViewAideEligible[];
  atAidType?: AtAidType;
  setAtAidType: React.Dispatch<AtAidType>;
  loading?: boolean;
};

export const DynamicAtAidTypeSelect = ({
  aidesEligibles = [],
  atAidType,
  setAtAidType,
  loading
}: DynamicAtAideTypeSelectProps) => {
  return (
    <Select
      label="Filtrer sur la nature de l'aide"
      disabled={loading !== false}
      options={[{ label: "nature de l'aide", value: '' }].concat(
        aidesEligibles
          .map(({ aide: { types } }) => types.map(({ name }) => name))
          .flat(2)
          .filter(unique)
          .map((type) => ({
            label: type,
            value: type as AtAidType
          }))
      )}
      nativeSelectProps={{
        name: 'aide_type',
        value: atAidType,
        onChange: (event) => setAtAidType(event.target.value as AtAidType)
      }}
    />
  );
};
