import { Ollama } from 'ollama';
import models from 'data/model-data.json';
import assistants from 'data/ai-assistants.json';
import { ModelParameters } from '@/infra/ai/model-parameters';
import { AiAssistantConfiguration, NamedAssistantConfiguration } from '@/infra/ai/ai-assistant-configuration';

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

export const getModelDefaultParameters = (modelName: string): ModelParameters => {
  const modelExists = Object.hasOwnProperty.call(models, modelName);
  if (!modelExists) {
    throw new Error(`Model "${modelName}" has no configuration.`);
  }

  // @ts-expect-error key existence is tested above
  return models[modelName];
};

export const getAssistantConfiguration = (assistantName: string): NamedAssistantConfiguration => {
  const assistantExists = Object.hasOwnProperty.call(assistants, assistantName);
  if (!assistantExists) {
    throw new Error(`AI assistant "${assistantName}" doesn't exist.`);
  }

  // @ts-expect-error key existence is tested above
  const assistantConfiguration: AiAssistantConfiguration = assistants[assistantName];
  const defaultModelParameters: ModelParameters = getModelDefaultParameters(assistantConfiguration.model);

  return {
    name: assistantName,
    ...assistantConfiguration,
    model_parameters: {
      ...defaultModelParameters,
      ...assistantConfiguration.model_parameters
    }
  };
};
