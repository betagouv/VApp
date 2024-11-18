import { GenerateResponse, Ollama, Options } from 'ollama';
import { Projet } from '@/domain/models/projet';
import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { getModelConfiguration, ModelConfiguration, ollama } from '@/infra/ollama';
import { OllamaServiceInterface } from '@/infra/services/ollama-service.interface';
import { user, system } from '@/infra/prompts/reformulation';
import { AbortableAsyncIterator } from '@/libs/utils/types';

export class ReformulationService implements ReformulationServiceInterface, OllamaServiceInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private modelConfiguration: ModelConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.getModelName()} from ${this.getModelFrom()}...`);

    return Promise.resolve();
  }

  public async reformuler(
    { description }: Pick<Projet, 'description'>,
    questionsReponses: QuestionReponse[]
  ): Promise<AbortableAsyncIterator<GenerateResponse>> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.ollama.generate({
      model: this.getModelFrom(),
      options: this.getRequestOptions({
        num_ctx: 16384,
        num_predict: 2048
      }),
      prompt: user({ description }, questionsReponses),
      stream: true
    });
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
  getModelConfiguration('reformulation-agent', 'mistral-nemo:latest', system)
);
