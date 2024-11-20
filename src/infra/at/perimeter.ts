import { Territoire } from '@/domain/models/territoire';

export type TerritoireAutocompleteType = {
  value: string;
  text: string;
};

export type TerritoireAutocompleteTypeResponse = {
  results: TerritoireAutocompleteType[];
};

export enum PerimeterScale {
  commune = 'commune',
  epci = 'epci',
  basin = 'Bassin hydrographique',
  department = 'Département',
  region = 'Région',
  overseas = 'Outre-mer',
  mainland = 'Métropole',
  adhoc = 'Ad-hoc',
  country = 'Pays',
  continent = 'Continent'
}

export interface PerimeterInterface {
  id: string;
  text: string;
  name: string;
  scale: PerimeterScale;
  zipcodes: string[];
  code: string;
}

export class Perimeter {
  static toTerritoire({ text, name, id }: PerimeterInterface): Partial<Territoire> {
    return {
      nom: name,
      description: text,
      aidesTerritoiresId: id
    };
  }
}
