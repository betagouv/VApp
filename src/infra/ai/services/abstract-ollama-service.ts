import ky, { HTTPError } from 'ky';
import { Ollama, Options } from 'ollama';
import { OllamaServiceInterface } from '@/infra/ai/services/ollama-service.interface';
import { NamedAssistantConfiguration } from '@/infra/ai/ai-assistant-configuration';
import { ComputeServiceNotAvailableError } from '@/infra/ai/compute-service-not-available.error';

export abstract class AbstractOllamaService implements OllamaServiceInterface {
  protected initialized: boolean = false;

  constructor(
    protected ollama: Ollama,
    protected assistantConfiguration: NamedAssistantConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.assistantConfiguration.name} from ${this.assistantConfiguration.model}...`);

    try {
      await ky.get(process.env.OLLAMA_HOST);
    } catch (e) {
      if (e instanceof HTTPError) {
        throw new ComputeServiceNotAvailableError(`Couldn't reach compute service: ${e.response.status} ${e.message}`);
      } else if (e instanceof Error) {
        throw new ComputeServiceNotAvailableError(`Couldn't reach compute service: ${e.message}`);
      }
      throw new ComputeServiceNotAvailableError(`Couldn't reach compute service at ${process.env.OLLAMA_HOST}`);
    }

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
