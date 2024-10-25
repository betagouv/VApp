import { system } from './prompts/system';
import { ChatRequest, Ollama, CreateRequest } from 'ollama';

const modelfile = `
FROM ${process.env.OLLAMA_MODEL_NAME || 'llama3.2:1b'}
SYSTEM "${system}"
`;

export const modelRequest: CreateRequest = {
  model: 'assistagent',
  modelfile
};

const tools: ChatRequest['tools'] = [
  {
    type: 'function',
    function: {
      name: 'calculer_eligibilite',
      description: "Calcul le score d'éligibilité à une aide.",
      parameters: {
        type: 'object',
        properties: {
          eligibilite: {
            type: 'number',
            description: "Le score d'éligibilité à une aide."
          }
        },
        required: ['eligibilite']
      }
    }
  }
];

const fetchWithHeaders = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const defaultHeaders = process.env.OLLAMA_JWT
    ? {
        Authorization: `Bearer ${Buffer.from(process.env.OLLAMA_JWT, 'utf8')}  `
      }
    : {};

  const enhancedInit: RequestInit = {
    ...init,
    headers: {
      ...defaultHeaders,
      ...init?.headers
    }
  };
  console.debug(input);
  return fetch(input, enhancedInit);
};

export const ollama = new Ollama({
  host: process.env.OLLAMA_HOST,
  fetch: fetchWithHeaders
});
