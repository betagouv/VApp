import { z } from 'zod';
import { PaginatedResult } from '@/libs/pagination';

export const JsonAPICollectionLinksSchema = z
  .object({
    first: z.string().url().optional().describe('Lien vers la première page'),
    last: z.string().url().optional().describe('Lien vers la dernière page'),
    prev: z.string().url().optional().describe('Lien vers la page précédente'),
    next: z.string().url().optional().describe('Lien vers la page suivante')
  })
  .describe('Objet "links" JSON:API pour la pagination');

export type JsonAPICollectionLinksInterface = z.infer<typeof JsonAPICollectionLinksSchema>;

export class JsonAPICollectionLinks implements JsonAPICollectionLinksInterface {
  constructor(
    public first: string,
    public last: string,
    public prev?: string,
    public next?: string
  ) {}

  static fromPaginatedResult<T>(
    { currentPage, lastPage }: PaginatedResult<T>,
    requestedURL: URL
  ): JsonAPICollectionLinks {
    return new JsonAPICollectionLinks(
      JsonAPICollectionLinks.getPageLink(requestedURL, 1),
      JsonAPICollectionLinks.getPageLink(requestedURL, lastPage),
      currentPage > 1 ? JsonAPICollectionLinks.getPageLink(requestedURL, currentPage - 1) : undefined,
      currentPage < lastPage ? JsonAPICollectionLinks.getPageLink(requestedURL, currentPage + 1) : undefined
    );
  }

  static getPageLink(requestedURL: URL, page?: number) {
    const pageURL = new URL(requestedURL.href);
    if (page) {
      pageURL.searchParams.set('page', String(page));
    }
    return `${pageURL.pathname}${pageURL.search}`;
  }
}
