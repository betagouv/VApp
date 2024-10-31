import { Options } from 'ollama';

export interface OllamaServiceInterface {
  getModelParameters(): Partial<Options>;
  getModelName(): string;
  getModelFrom(): string;
  getRequestOptions(options: Partial<Options>): Partial<Options>;
}
