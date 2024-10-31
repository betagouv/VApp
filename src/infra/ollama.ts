import { CreateRequest, Ollama, Options } from 'ollama';
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

export const getModelParameters = (modelName: string): Partial<Options> => {
  const modelExists = Object.hasOwnProperty.call(models, modelName);
  if (!modelExists) {
    throw new Error(`Model ${modelName} doesn't exist.`);
  }

  // @ts-expect-error key existence is tested above
  return models[modelName];
};

export const createModelFile = (from: string, system: string) => `FROM ${from}
SYSTEM "${system}"`;

export const createModelRequest = (name: string, from: string, system: string) => ({
  model: name,
  modelfile: createModelFile(from, system)
});

export type ModelConfiguration = { request: CreateRequest; parameters: Partial<Options>; from: string };

export const getModelConfiguration = (name: string, from: string, system: string): ModelConfiguration => ({
  request: createModelRequest(name, from, system),
  parameters: getModelParameters(from),
  from
});
