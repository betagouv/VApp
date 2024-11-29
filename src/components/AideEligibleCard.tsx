import * as React from 'react';
import { formatNote, noteToPercent } from '@/domain/note';
import Card from '@codegouvfr/react-dsfr/Card';
import Tag from '@codegouvfr/react-dsfr/Tag';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import { Aide } from '@/domain/models/aide';
import { ClassProperties } from '@/libs/utils/types';

function getColor(value: number) {
  console.assert(value >= 0 && value <= 1, `${value} isn't comprised between 0 and 1`);
  const hue = (value * 120).toString(10);
  return ['hsl(', hue, ',100%,50%)'].join('');
}

export type AideEligibleCard = {
  aide: ClassProperties<Aide>;
  eligibilite: number;
};

export const AideEligibleCard = ({ aide, eligibilite }: AideEligibleCard) => {
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
            <Tooltip title="Score d'éligibilité" kind="hover">
              <Tag style={{ backgroundColor: getColor(noteToPercent(eligibilite)) }}>{formatNote(eligibilite)}</Tag>
            </Tooltip>
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
