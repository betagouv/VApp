import * as React from 'react';
import { formatNote, noteToPercent } from '@/domain/note';
import Card from '@codegouvfr/react-dsfr/Card';
import Badge from '@codegouvfr/react-dsfr/Badge';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import { Aide } from '@/domain/models/aide';

function getColor(value: number) {
  console.assert(value >= 0 && value <= 1, `${value} isn't commprised between 0 and 1`);
  const hue = (value * 120).toString(10);
  return ['hsl(', hue, ',100%,50%)'].join('');
}

export type AideEligibleCard = {
  aide: Aide;
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
        href: aide.getAidesTerritoiresUrl()
      }}
      start={
        <ul className="fr-badges-group">
          <li>
            <Tooltip title="Score d'éligibilité" kind="hover">
              <Badge style={{ backgroundColor: getColor(noteToPercent(eligibilite)) }}>{formatNote(eligibilite)}</Badge>
            </Tooltip>
          </li>
        </ul>
      }
      title={aide.nom}
      titleAs="h3"
    />
  );
};
