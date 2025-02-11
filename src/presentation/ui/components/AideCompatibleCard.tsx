import * as React from 'react';
import Card from '@codegouvfr/react-dsfr/Card';
import Tag from '@codegouvfr/react-dsfr/Tag';
import { ClassProperties } from '@/presentation/types';

import { AideScore } from '@/domain/models/aide-score';
import { Aide } from '@/domain/models/aide';

function getColor(value: number) {
  console.assert(value >= 0 && value <= 1, `${value} isn't comprised between 0 and 1`);
  const hue = (value * 120).toString(10);
  return ['hsl(', hue, ',100%,50%)'].join('');
}

export type AideCompatibleCard = {
  aide: ClassProperties<Aide>;
  compatibilite: number;
};

export const AideCompatibleCard = ({ aide, compatibilite }: AideCompatibleCard) => {
  return (
    <Card
      size="small"
      background
      border
      enlargeLink
      horizontal
      linkProps={{
        href: Aide.getAidesTerritoiresUrl(aide)
      }}
      start={
        <ul className="fr-tags-group">
          <li>
            <Tag style={{ backgroundColor: getColor(AideScore.toPercent(compatibilite)) }}>
              {AideScore.format(compatibilite)}
            </Tag>
          </li>
          {aide.types.map(({ id, name }) => (
            <li key={`aide-type-${id}`}>
              <Tag iconId="ri-hand-coin-line">{name}</Tag>
            </li>
          ))}
          {aide.programmes.map((programme) => (
            <li key={`aide-${programme}`}>
              <Tag>{programme}</Tag>
            </li>
          ))}
        </ul>
      }
      title={aide.nom}
      titleAs="h3"
    />
  );
};
