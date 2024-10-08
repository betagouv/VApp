import { ProjetEntity } from './projet.entity';

export class AgentEntity {
  public uuid: string;
  public projects: ProjetEntity[] = [];

  constructor(uuid: string, projects: ProjetEntity[] = []) {
    this.uuid = uuid;
    this.projects = projects;
  }
}
