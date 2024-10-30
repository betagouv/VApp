import { CreateRequest, Ollama } from 'ollama';
import { QuestionsGeneratorInterface } from '@/domain/services/questions-generator.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { Question } from '@/domain/models/question';
import { createModelRequest, ollama } from '@/infra/ollama';
import { system, user } from '@/infra/prompts/questions';
import { ollamaQuestionsDtoSchema } from '@/infra/dtos/ollama-questions.dto';

export class QuestionsGenerator implements QuestionsGeneratorInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private modelRequest: CreateRequest
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.modelRequest.model}...`);
    await this.ollama.create({ ...this.modelRequest, stream: false });
    this.initialized = true;

    return Promise.resolve();
  }

  public async generateQuestions(projet: Projet, aides: Aide[]): Promise<Question[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    const {
      message: { content }
    } = await this.ollama.chat({
      model: this.modelRequest.model,
      messages: [
        {
          role: 'user',
          content: user(projet, aides)
        }
      ],
      format: 'json'
    });

    const { Q1, Q2, Q3 } = ollamaQuestionsDtoSchema.parse(content);

    return Promise.resolve([Q1, Q2, Q3]);
  }
}

export const questionsGenerator = new QuestionsGenerator(
  ollama,
  createModelRequest('questions-agent', 'qwen2.5:14b', system)
);
