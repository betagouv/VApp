import { KyInstance } from 'ky';
import { LesCommunsApiClientInterface } from '@/infra/les-communs/api-client.interface';
import { LcProjectDto, lcProjectDtoSchema } from '@/infra/les-communs/dtos/lc-project.dto';
import { fetch } from '@/infra/fetch';

export class LesCommunsApiClient implements LesCommunsApiClientInterface {
  constructor(
    public apiClient: KyInstance,
    public projectSchema: typeof lcProjectDtoSchema,
    public baseUrl: string,
    private bearerToken: string
  ) {}

  headers() {
    if (!this.bearerToken) {
      return {};
    }
    return {
      Authorization: `Bearer ${this.bearerToken}`
    };
  }

  async getProjects(): Promise<LcProjectDto[]> {
    const url = `${this.baseUrl}/projects`;

    const response = await this.apiClient
      .get<LcProjectDto[]>(url, {
        headers: this.headers()
      })
      .json();

    return response.filter((v) => v?.status !== null).map((v) => this.projectSchema.parse(v));
  }
}

export const lesCommunsApiClient = new LesCommunsApiClient(
  fetch,
  lcProjectDtoSchema,
  process.env.LC_API_BASE_URL,
  process.env.LC_API_BEARER_TOKEN
);
