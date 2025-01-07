import { Options } from 'ollama';

export interface OllamaServiceInterface {
  getRequestOptions(options: Partial<Options>): Partial<Options>;
}
