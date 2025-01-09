import { GenerateResponse } from 'ollama';
import { Projet } from '@/domain/models/projet';
import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { getAssistantConfiguration, ollama } from '@/infra/ai/ollama';
import { user, system } from '@/infra/ai/prompts/reformulation';
import { AbstractOllamaService } from '@/infra/ai/services/abstract-ollama-service';
import { AbortableAsyncIterator } from '@/presentation/types';

export class ReformulationService extends AbstractOllamaService implements ReformulationServiceInterface {
  public async reformuler(
    { description }: Pick<Projet, 'description'>,
    questionsReponses: QuestionReponse[]
  ): Promise<AbortableAsyncIterator<GenerateResponse>> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.ollama.generate({
      model: this.assistantConfiguration.model,
      options: this.getRequestOptions({
        num_ctx: 16384,
        num_predict: 2048
      }),
      system,
      prompt: user({ description }, questionsReponses),
      stream: true
    });
  }
}

export const reformulationService = new ReformulationService(
  ollama,
  getAssistantConfiguration('reformulation-assistant')
);
