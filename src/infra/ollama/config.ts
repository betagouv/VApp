import { system } from './prompts/system';
import { PullRequest, ChatRequest, Ollama, CreateRequest } from 'ollama';

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

export const ollama = new Ollama({ host: process.env.OLLAMA_HOST });
