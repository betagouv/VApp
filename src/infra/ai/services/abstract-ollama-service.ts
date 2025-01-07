import { Ollama, Options } from 'ollama';
import { OllamaServiceInterface } from '@/infra/ai/services/ollama-service.interface';
import { NamedAssistantConfiguration } from '@/infra/ai/ai-assistant-configuration';

export abstract class AbstractOllamaService implements OllamaServiceInterface {
  protected initialized: boolean = false;

  constructor(
    protected ollama: Ollama,
    protected assistantConfiguration: NamedAssistantConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.assistantConfiguration.name} from ${this.assistantConfiguration.model}...`);
    this.initialized = true;

    return Promise.resolve();
  }

  getRequestOptions(options: Partial<Options> = {}): Partial<Options> {
    return {
      ...this.assistantConfiguration.model_parameters,
      ...this.assistantConfiguration.request_parameters,
      ...options
    };
  }
}
