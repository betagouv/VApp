import * as React from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { ViewAideEvalueeDto } from '@/presentation/ui/dtos/view-aide-evaluee.dto';
import { unique } from '@/presentation/ui/utils/array';
import { AtAidType } from '@/infra/at/aid-type';

type DynamicAtAideTypeSelectProps = {
  aidesCompatibles: ViewAideEvalueeDto[];
  atAidType?: AtAidType;
  setAtAidType: React.Dispatch<AtAidType>;
  loading?: boolean;
};

export const DynamicAtAidTypeSelect = ({
  aidesCompatibles = [],
  atAidType,
  setAtAidType,
  loading
}: DynamicAtAideTypeSelectProps) => {
  return (
    <Select
      label="Filtrer sur la nature de l'aide"
      disabled={loading !== false}
      options={[{ label: "nature de l'aide", value: '' }].concat(
        aidesCompatibles
          .map(({ aide: { types } }) => (types ? types.map(({ name }) => name) : []))
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
