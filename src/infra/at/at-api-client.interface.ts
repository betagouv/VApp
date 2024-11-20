import { AtAide } from '@/infra/dtos/at-aide.dto';
import { AtSearchAidsQuery } from '@/infra/at/search-aids-query';
import { Perimeter } from '@/infra/at/perimeter';

export interface AtApiClientInterface {
  searchAides(searchQuery: AtSearchAidsQuery): Promise<AtAide[]>;
  autocompletePerimeter(searchQuery: { q: string }): Promise<Perimeter[]>;
}
