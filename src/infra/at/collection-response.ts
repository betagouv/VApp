export type CollectionResponse<Type> = {
  count: number;
  next: string;
  results: Type[];
};
