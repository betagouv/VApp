import { Ollama } from 'ollama';
import models from 'data/model-data.json';

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

export const getModelParameters = (modelName: string) => {
  const modelExists = Object.hasOwnProperty.call(models, modelName);
  if (!modelExists) {
    throw new Error(`Model ${modelName} doesn't exist.`);
  }

  // @ts-expect-error key existence is tested above
  return models[modelName];
};

export const createModelFile = (from: string, system: string) => `FROM ${from}
${Object.entries(getModelParameters(from)).map(([k, v]) => `PARAMETER ${k.toLocaleUpperCase()} ${v}`)}
SYSTEM "${system}"`;

export const createModelRequest = (name: string, from: string, system: string) => ({
  model: 'notation-agent',
  modelfile: createModelFile(from, system)
});
