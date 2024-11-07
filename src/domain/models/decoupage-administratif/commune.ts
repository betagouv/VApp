import { Departement } from '@/domain/models/decoupage-administratif/departement';
import { Epci } from '@/domain/models/decoupage-administratif/epci';
import { Region } from '@/domain/models/decoupage-administratif/region';

export interface Commune {
  nom: string;
  code: string;
  departement: Departement;
  epci: Epci;
  region: Region;
}
