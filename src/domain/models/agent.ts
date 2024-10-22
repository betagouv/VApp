import { Projet } from './projet';

export class Agent {
  public uuid: string;
  public projects: Projet[] = [];

  constructor(uuid: string, projects: Projet[] = []) {
    this.uuid = uuid;
    this.projects = projects;
  }
}
