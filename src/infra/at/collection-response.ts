export type AtCollectionResponse<Type> = {
  count: number;
  next: string;
  results: Type[];
};
