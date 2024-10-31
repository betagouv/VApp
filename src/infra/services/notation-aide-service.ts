import { CreateRequest, Ollama, Options } from 'ollama';
import { NotationAideServiceInterface } from '@/domain/services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { assertValid } from '@/domain/note';
import { getModelConfiguration, ModelConfiguration, ollama } from '@/infra/ollama';
import { system, user } from '@/infra/prompts/notation';
import { OllamaServiceInterface } from '@/infra/services/ollama-service.interface';
import * as console from 'node:console';

export class NotationAideService implements NotationAideServiceInterface, OllamaServiceInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private modelConfiguration: ModelConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.getModelName()} from ${this.getModelFrom()}...`);
    await this.ollama.create({ ...this.modelConfiguration.request, stream: false });
    this.initialized = true;

    return Promise.resolve();
  }

  public async noterAide(aide: Aide, projet: Projet): Promise<number | void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const { response } = await this.ollama.generate({
        model: this.getModelName(),
        options: this.getRequestOptions({
          num_ctx: 16384,
          num_predict: 2
        }),
        prompt: user(aide, projet),
        stream: false
      });

      const note = Number(response);
      assertValid(
        note,
        `La réponse suivante n'est pas attribuable à une note:
  ${response} `
      );

      return Promise.resolve(note);
    } catch (e: unknown) {
      console.error(e);
      return Promise.resolve();
    }
  }

  getModelFrom(): string {
    return this.modelConfiguration.from;
  }

  getModelName(): string {
    return this.modelConfiguration.request.model;
  }

  getModelParameters(): Partial<Options> {
    return this.modelConfiguration.parameters;
  }

  getRequestOptions(options: Partial<Options> = {}): Partial<Options> {
    return {
      ...this.getModelParameters(),
      ...options
    };
  }
}

export const notationAideService = new NotationAideService(
  ollama,
  getModelConfiguration('notation-agent', 'llama3.2:1b', system)
);
