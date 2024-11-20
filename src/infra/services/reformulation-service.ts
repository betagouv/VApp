import { GenerateResponse, Ollama, Options } from 'ollama';
import { Projet } from '@/domain/models/projet';
import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { getAssistantConfiguration, ollama } from '@/infra/ollama';
import { OllamaServiceInterface } from '@/infra/services/ollama-service.interface';
import { user, system } from '@/infra/prompts/reformulation';
import { AbortableAsyncIterator } from '@/libs/utils/types';
import { NamedAssistantConfiguration } from '@/infra/ai-assistant-configuration';

export class ReformulationService implements ReformulationServiceInterface, OllamaServiceInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private assistantConfiguration: NamedAssistantConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.assistantConfiguration.name} from ${this.assistantConfiguration.model}...`);

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
      model: this.assistantConfiguration.model,
      options: this.getRequestOptions({
        num_ctx: 16384,
        num_predict: 2048
      }),
      system,
      prompt: user({ description }, questionsReponses),
      stream: true
    });
  }

  getRequestOptions(options: Partial<Options> = {}): Partial<Options> {
    return {
      ...this.assistantConfiguration.model_parameters,
      ...this.assistantConfiguration.request_parameters,
      ...options
    };
  }
}

export const reformulationService = new ReformulationService(
  ollama,
  getAssistantConfiguration('reformulation-assistant')
);
