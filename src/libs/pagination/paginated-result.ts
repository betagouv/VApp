export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  lastPage: number;
  currentPage: number;
}
// PartialCollectionView
// https://www.hydra-cg.com/spec/latest/core/#example-20-a-hydra-partialcollectionview-splits-a-collection-into-multiple-views
