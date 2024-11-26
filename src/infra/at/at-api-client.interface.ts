import { AtAid } from '@/infra/at/aid';
import { AtSearchAidsQuery } from '@/infra/at/search-aids-query';
import { AtPerimeter } from '@/infra/at/perimeter';

export interface AtApiClientInterface {
  searchAides(searchQuery: AtSearchAidsQuery): Promise<AtAid[]>;
  autocompletePerimeter(searchQuery: { q: string }): Promise<AtPerimeter[]>;
}
