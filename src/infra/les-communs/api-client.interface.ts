import { LcProjectDto } from '@/infra/les-communs/dtos/lc-project.dto';

export interface LesCommunsApiClientInterface {
  getProjects(): Promise<LcProjectDto[]>;
}
