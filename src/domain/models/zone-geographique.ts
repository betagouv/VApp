import { AtPerimeterScale } from '@/infra/at/perimeter';

export type ZoneGeographique = {
  id: string;
  nom: string;
  description: string;
  code: string;
  type: AtPerimeterScale;
};
