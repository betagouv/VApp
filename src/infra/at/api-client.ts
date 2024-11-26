import { Hooks } from 'ky';
import { AtAid } from '@/infra/at/aid';
import { AtPerimeter } from '@/infra/at/perimeter';
import { api } from '@/infra/at/api';
import { AtSearchAidsQuery } from '@/infra/at/search-aids-query';
import { AtCollectionResponse } from '@/infra/at/collection-response';
import { AtApiClientInterface } from '@/infra/at/at-api-client.interface';

type scalar = string | boolean | number;

function appendIfDefined(searchParams: URLSearchParams, name: string) {
  return (value?: scalar) => {
    if (typeof value !== 'undefined') {
      searchParams.append(name, value.toString());
    }
  };
}

function appendArrayIfDefined<T extends scalar>(searchParams: URLSearchParams, name: string) {
  return (value?: T[]) => {
    if (typeof value !== 'undefined') {
      value.forEach(appendIfDefined(searchParams, name));
    }
  };
}

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

  static appendIfDefined(searchParams: URLSearchParams, searchParam: string | boolean | number) {
    if (typeof searchParams !== 'undefined') {
      searchParams.append('perimeter_id', searchParam.toString());
    }
  }

  async searchAides(searchQuery: AtSearchAidsQuery): Promise<AtAid[]> {
    const searchParams = new URLSearchParams();
    appendArrayIfDefined(searchParams, 'organization_type_slugs')(searchQuery.organization_type_slugs);
    appendArrayIfDefined(searchParams, 'aid_type_group_slug')(searchQuery.aid_type_group_slug);
    appendArrayIfDefined(searchParams, 'aid_destination_slugs')(searchQuery.aid_destination_slugs);
    appendArrayIfDefined(searchParams, 'aid_step_slugs')(searchQuery.aid_step_slugs);
    appendIfDefined(searchParams, 'perimeter_id')(searchQuery?.perimeter_id);
    appendIfDefined(searchParams, 'is_charged')(searchQuery.is_charged);

    const url = `${this.baseUrl}/aids/?${searchParams.toString()}`;
    console.log(url);

    const response = await api
      .get<AtCollectionResponse<AtAid>>(url, {
        hooks: this.hooks(),
        headers: this.headers()
      })
      .json();

    return await this.fetchAllFromCollection<AtAid>(response);
  }

  async fetchAllFromCollection<Type>({ next, count, results }: AtCollectionResponse<Type>): Promise<Type[]> {
    let allResults: Type[] = results;
    let nextURL: string = next;
    while (allResults.length < count) {
      const { results, next } = await api
        .get<AtCollectionResponse<Type>>(nextURL, { hooks: this.hooks(), headers: this.headers() })
        .json();
      allResults = allResults.concat(results);
      nextURL = next;
    }

    return allResults;
  }

  async fetchAllPerimeters() {
    const response = await api
      .get<AtCollectionResponse<AtPerimeter>>(`${this.baseUrl}/perimeters/`, {
        hooks: this.hooks(),
        headers: this.headers()
      })
      .json();

    return await this.fetchAllFromCollection<AtPerimeter>(response);
  }

  async autocompletePerimeter(searchQuery: { q: string | null }): Promise<AtPerimeter[]> {
    if (!searchQuery?.q) {
      return [];
    }

    const { results } = await api
      .get<AtCollectionResponse<AtPerimeter>>(`${this.baseUrl}/perimeters?q=${searchQuery?.q}`, {
        hooks: this.hooks(),
        headers: this.headers()
      })
      .json();

    return results;
  }
}

export const atApiClient = new AtApiClient('https://aides-territoires.beta.gouv.fr/api', process.env.AT_API_JWT);
