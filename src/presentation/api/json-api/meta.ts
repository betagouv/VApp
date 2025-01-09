import { z } from 'zod';
import { PaginatedResult } from '@/libs/pagination';

export const JsonAPIMetaSchema = z
  .object({
    totalItems: z.coerce.number().describe('Total number of items in the full collection')
  })
  .describe('JSON:API "meta" object with pagination info');

export type JsonAPIMetaInterface = z.infer<typeof JsonAPIMetaSchema>;

export class JsonAPIMeta implements JsonAPIMetaInterface {
  constructor(public totalItems: number) {}

  static fromPaginatedResult<T>(paginatedResult: PaginatedResult<T>): JsonAPIMeta {
    return new JsonAPIMeta(paginatedResult.totalItems);
  }
}
