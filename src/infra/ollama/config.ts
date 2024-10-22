import { system } from './prompts/system';
import type { CreateRequest } from 'ollama/src/interfaces';

const modelfile = `
FROM llama3.1
SYSTEM "${system}"
`;

export const modelCreationRequest: CreateRequest = {
  model: 'example',
  modelfile
};
