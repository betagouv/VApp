import { system } from './prompts/system';
import type { CreateRequest as OllamaCreateRequest } from 'ollama/src/interfaces';
import { Ollama } from 'ollama';

export type CreateRequest = OllamaCreateRequest & {
  stream?: false;
};

const modelfile = `
FROM llama3.2:1b
SYSTEM "${system}"
`;

export const modelCreationRequest: CreateRequest = {
  model: 'example',
  modelfile,
  stream: false,
};

export const ollama = new Ollama({ host: process.env.OLLAMA_HOST })
