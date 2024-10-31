import { CreateRequest, Ollama, Options } from 'ollama';
import { QuestionsGeneratorInterface } from '@/domain/services/questions-generator.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { Question } from '@/domain/models/question';
import { getModelConfiguration, ModelConfiguration, ollama } from '@/infra/ollama';
import { system, user } from '@/infra/prompts/questions';
import { ollamaQuestionsDtoSchema } from '@/infra/dtos/ollama-questions.dto';
import { OllamaServiceInterface } from '@/infra/services/ollama-service.interface';
import * as console from 'node:console';

export class QuestionsGenerator implements QuestionsGeneratorInterface, OllamaServiceInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private modelConfiguration: ModelConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.getModelName()} from ${this.getModelFrom()}...`);
    await this.ollama.create({ ...this.modelConfiguration.request, stream: false });
    this.initialized = true;

    return Promise.resolve();
  }

  public async generateQuestions(projet: Projet, aides: Aide[]): Promise<Question[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const { response } = await this.ollama.generate({
      model: this.getModelName(),
      options: this.getRequestOptions({
        num_ctx: 16384,
        num_predict: 512
      }),
      prompt: user(projet, aides),
      stream: false,
      format: 'json'
    });

    console.log(response);
    console.log(typeof response);
    const { Q1, Q2, Q3 } = ollamaQuestionsDtoSchema.parse(JSON.parse(response));

    return Promise.resolve([Q1, Q2, Q3]);
  }

  getModelFrom(): string {
    return this.modelConfiguration.from;
  }

  getModelName(): string {
    return this.modelConfiguration.request.model;
  }

  getModelParameters(): Partial<Options> {
    return this.modelConfiguration.parameters;
  }

  getRequestOptions(options: Partial<Options> = {}): Partial<Options> {
    return {
      ...this.getModelParameters(),
      ...options
    };
  }
}

export const questionsGenerator = new QuestionsGenerator(
  ollama,
  getModelConfiguration('questions-agent', 'qwen2.5:14b', system)
);
