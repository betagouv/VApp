export enum AtPerimeterScale {
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

export type AtPerimeter = {
  id: string;
  text: string;
  name: string;
  scale: AtPerimeterScale;
  zipcodes: string[];
  code: string;
};
