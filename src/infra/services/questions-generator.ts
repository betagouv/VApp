import { Ollama, Options } from 'ollama';
import type { SafeParseReturnType } from 'zod';

import { getAssistantConfiguration, ollama } from '@/infra/ollama';
import { OllamaServiceInterface } from '@/infra/services/ollama-service.interface';
import { OllamaQuestionsDto, ollamaQuestionsDtoSchema } from '@/infra/dtos/ollama-questions.dto';
import { system, user } from '@/infra/prompts/questions';
import { QuestionsGeneratorInterface } from '@/domain/services/questions-generator.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { Question } from '@/domain/models/question';
import { NamedAssistantConfiguration } from '@/infra/ai-assistant-configuration';

export class QuestionsGenerator implements QuestionsGeneratorInterface, OllamaServiceInterface {
  private initialized: boolean = false;
  static MAX_ATTEMPT = 3;

  constructor(
    private ollama: Ollama,
    private assistantConfiguration: NamedAssistantConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.assistantConfiguration.name} from ${this.assistantConfiguration.model}...`);
    this.initialized = true;

    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static safeJsonParse(malformedJsonResponse: string, reviver?: (this: any, key: string, value: any) => any): object {
    const emptyJsonResponse = '{}';
    let json = JSON.parse(emptyJsonResponse, reviver);
    try {
      json = JSON.parse(malformedJsonResponse, reviver);
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.warn(e.message);
      } else {
        console.warn(e);
      }
    }

    return json;
  }

  public async generateQuestions(projet: Projet, aides: Aide[]): Promise<Question[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    let attemptSeed = 1;
    let ollamaResponse: string | undefined;
    let validationResponse: SafeParseReturnType<unknown, OllamaQuestionsDto> | undefined;
    for (attemptSeed; attemptSeed < QuestionsGenerator.MAX_ATTEMPT; attemptSeed++) {
      ollamaResponse = (await this.attemptToGenerateQuestions(projet, aides, attemptSeed)).response;
      validationResponse = ollamaQuestionsDtoSchema.safeParse(QuestionsGenerator.safeJsonParse(ollamaResponse));

      if (validationResponse.success) {
        break;
      }
    }

    if (!validationResponse?.success && attemptSeed >= QuestionsGenerator.MAX_ATTEMPT) {
      throw new Error(
        `Malgré ${attemptSeed} tentative(s), la génération des questions sur le projet ${projet.uuid} et pour les aides ${aides.map(Aide.getId).join(', ')} a échoué.
La dernière réponse reçu était la suivante:
${ollamaResponse}`
      );
    }

    if (!validationResponse?.data) {
      throw new Error(`Il semble que la génération ai échoué avant la validation. Cel n'est pas sensé arrivé.`);
    }

    const { Q1, Q2, Q3 } = validationResponse.data;

    return Promise.resolve([Q1, Q2, Q3]);
  }

  private async attemptToGenerateQuestions(projet: Projet, aides: Aide[], seed: number = 1) {
    return this.ollama.generate({
      model: this.assistantConfiguration.model,
      options: this.getRequestOptions({
        num_ctx: 16384,
        num_predict: 512,
        seed
      }),
      system,
      prompt: user(projet, aides),
      stream: false,
      format: 'json'
    });
  }

  getRequestOptions(options: Partial<Options> = {}): Partial<Options> {
    return {
      ...this.assistantConfiguration.model_parameters,
      ...this.assistantConfiguration.request_parameters,
      ...options
    };
  }
}

export const questionsGenerator = new QuestionsGenerator(ollama, getAssistantConfiguration('questions-assistant'));
