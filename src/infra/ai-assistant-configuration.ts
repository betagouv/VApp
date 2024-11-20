import { ModelParameters } from '@/infra/model-parameters';

export type AiAssistantConfiguration = {
  model: string;
  request_parameters: {
    num_ctx: number;
    num_predict: number;
  };
  model_parameters: ModelParameters;
};

export type NamedAssistantConfiguration = { name: string } & AiAssistantConfiguration;
