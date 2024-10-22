import { Ollama } from 'ollama';
import { CreateRequest } from '@/infra/ollama/config';
import { NotationAideServiceInterface } from '@/domain/services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';

export class NotationAideService implements NotationAideServiceInterface {
  private initialized: boolean;

  constructor(private ollama: Ollama, private modelCreationRequest: CreateRequest) {
    this.initialized = false;
  }

  private async initialize() {
    await this.ollama.create(this.modelCreationRequest)
  }

  public async noterAide(aide: Aide, projet: Projet): Promise<number> {
    if (!this.initialized) {
      await this.initialize();
    }

    await this.ollama.chat({
      model: this.modelCreationRequest.model,
      messages: [],
      tools: []
    })

    return Promise.resolve(0);
  }
}
