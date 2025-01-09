import { PaginatedResult } from '@/libs/pagination';
import { JsonAPICollectionLinks } from '@/presentation/api/json-api/links';
import { JsonAPIMeta } from '@/presentation/api/json-api/meta';

export class JsonAPICollection<T> {
  constructor(
    public data: T[],
    public links: JsonAPICollectionLinks,
    public meta: JsonAPIMeta
  ) {}

  static fromPaginatedResult<T>(paginatedResult: PaginatedResult<T>, requestedURL: URL): JsonAPICollection<T> {
    return new JsonAPICollection<T>(
      paginatedResult.data,
      JsonAPICollectionLinks.fromPaginatedResult(paginatedResult, requestedURL),
      JsonAPIMeta.fromPaginatedResult(paginatedResult)
    );
  }
}
