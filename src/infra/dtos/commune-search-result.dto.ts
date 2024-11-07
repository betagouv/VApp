import { Commune } from '@/domain/models/decoupage-administratif/commune';

export interface CommuneSearchResultDto extends Commune {
  _score: number;
}
