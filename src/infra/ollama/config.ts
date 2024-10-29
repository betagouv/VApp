import { system } from './prompts/system';
import { Ollama, CreateRequest } from 'ollama';

const modelfile = `
FROM ${process.env.OLLAMA_MODEL_NAME || 'llama3.2:1b'}
SYSTEM "${system}"
`;

export const modelRequest: CreateRequest = {
  model: 'assistagent',
  modelfile
};

const fetchWithHeaders = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const defaultHeaders = process.env.OLLAMA_JWT
    ? {
        Authorization: `Bearer ${Buffer.from(process.env.OLLAMA_JWT, 'utf8')}  `
      }
    : {};

  const enhancedInit: RequestInit = {
    ...init,
    // @ts-expect-error dunno
    headers: {
      ...defaultHeaders,
      ...init?.headers
    }
  };

  return fetch(input, enhancedInit);
};

export const ollama = new Ollama({
  host: process.env.OLLAMA_HOST,
  fetch: fetchWithHeaders
});
