import { Project } from "playwright/test";

class AgentEntity {
    public uuid: string;
    public projects: Project[] = [];

    constructor(uuid: string, projects: Project[] = []) {
        this.uuid = uuid;
        this.projects = projects;
    }
}