import { Ollama, Options } from 'ollama';
import { Projet } from '@/domain/models/projet';
import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { getModelConfiguration, ModelConfiguration, ollama } from '@/infra/ollama';
import { projetRepository, ProjetRepository } from '@/infra/repositories/projet.repository';
import { OllamaServiceInterface } from '@/infra/services/ollama-service.interface';
import { user, system } from '@/infra/prompts/reformulation';
import * as console from 'node:console';

export class ReformulationService implements ReformulationServiceInterface, OllamaServiceInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private modelConfiguration: ModelConfiguration,
    private projetRepository: ProjetRepository
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.getModelName()} from ${this.getModelFrom()}...`);

    return Promise.resolve();
  }

  public async reformuler(projet: Projet, questionsReponses: QuestionReponse[]): Promise<Projet> {
    if (!this.initialized) {
      await this.initialize();
    }

    const { response } = await this.ollama.generate({
      model: this.getModelFrom(),
      options: this.getRequestOptions({
        num_ctx: 16384,
        num_predict: 2048
      }),
      prompt: user(projet, questionsReponses),
      stream: false
    });

    projet.reformuler(response);

    await this.projetRepository.update(projet);

    return Promise.resolve(projet);
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

export const reformulationService = new ReformulationService(
  ollama,
  getModelConfiguration('reformulation-agent', 'qwen2.5:14b', system),
  projetRepository
);
