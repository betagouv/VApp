import { Hooks } from 'ky';
import { AtAide } from '@/infra/dtos/at-aide.dto';
import { PerimeterInterface } from '@/infra/at/perimeter';
import { api } from '@/infra/at/api';
import { AtSearchAidsQuery } from '@/infra/at/search-aids-query';
import { CollectionResponse } from '@/infra/at/collection-response';
import { AtApiClientInterface } from '@/infra/at/at-api-client.interface';

export class AtApiClient implements AtApiClientInterface {
  private bearerToken: string | undefined;

  constructor(
    public baseUrl: string,
    private jwt: string
  ) {}

  async renewBearerToken(): Promise<void> {
    const { token } = await api
      .post<{ token: string }>(`${this.baseUrl}/connexion/`, {
        headers: {
          'X-AUTH-TOKEN': this.jwt
        }
      })
      .json();

    this.bearerToken = token;
  }

  headers() {
    if (!this.bearerToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${this.bearerToken}`
    };
  }

  hooks(): Hooks {
    return {
      afterResponse: [
        // (_request, _options, response) => {
        //   // You could do something with the response, for example, logging.
        //   console.log(response);
        //
        //   // Or return a `Response` instance to overwrite the response.
        //   return new Response('A different response', { status: 200 });
        // },

        // Or retry with a fresh token on a 403 error
        async (request, options, response) => {
          if (response.status === 403 || response.status === 401) {
            // Retry with the token
            await this.renewBearerToken();
            request.headers.set('Authorization', `Bearer ${this.bearerToken}`);
            return api(request);
          }
        }
      ]
    };
  }

  async searchAides(searchQuery: AtSearchAidsQuery): Promise<AtAide[]> {
    const searchParams = new URLSearchParams();
    searchQuery.organization_type_slugs.forEach((audience) => {
      searchParams.append('organization_type_slugs', audience);
    });
    if (searchQuery?.perimeter_id) {
      searchParams.append('perimeter_id', searchQuery.perimeter_id);
    }
    if (searchQuery?.is_charged) {
      searchParams.append('is_charged', searchQuery.is_charged.toString());
    }

    const url = `${this.baseUrl}/aids/?${searchParams.toString()}`;
    console.log(url);

    const response = await api
      .get<CollectionResponse<AtAide>>(url, {
        hooks: this.hooks(),
        headers: this.headers()
      })
      .json();

    return await this.fetchAllFromCollection<AtAide>(response);
  }

  async fetchAllFromCollection<Type>({ next, count, results }: CollectionResponse<Type>): Promise<Type[]> {
    let allResults: Type[] = results;
    let nextURL: string = next;
    while (allResults.length < count) {
      const { results, next } = await api
        .get<CollectionResponse<Type>>(nextURL, { hooks: this.hooks(), headers: this.headers() })
        .json();
      allResults = allResults.concat(results);
      nextURL = next;
    }

    return allResults;
  }

  async fetchAllPerimeters() {
    const response = await api
      .get<CollectionResponse<PerimeterInterface>>(`${this.baseUrl}/perimeters/`, {
        hooks: this.hooks(),
        headers: this.headers()
      })
      .json();

    return await this.fetchAllFromCollection<PerimeterInterface>(response);
  }

  async autocompletePerimeter(searchQuery: { q: string | null }): Promise<PerimeterInterface[]> {
    if (!searchQuery?.q) {
      return [];
    }

    const { results } = await api
      .get<CollectionResponse<PerimeterInterface>>(`${this.baseUrl}/perimeters?q=${searchQuery?.q}`, {
        hooks: this.hooks(),
        headers: this.headers()
      })
      .json();

    return results;
  }
}

export const atApiClient = new AtApiClient('https://aides-territoires.beta.gouv.fr/api', process.env.AT_API_JWT);
