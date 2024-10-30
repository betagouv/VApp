import { CreateRequest, Ollama } from 'ollama';
import { Projet } from '@/domain/models/projet';
import { ReformulationServiceInterface } from '@/domain/services/reformulation-service.interface';
import { QuestionReponse } from '@/domain/models/question-reponse';
import { createModelRequest, ollama } from '@/infra/ollama';
import { projetRepository, ProjetRepository } from '@/infra/repositories/projet.repository';
import { user, system } from '@/infra/prompts/reformulation';

export class ReformulationService implements ReformulationServiceInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private modelRequest: CreateRequest,
    private projetRepository: ProjetRepository
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.modelRequest.model}...`);
    await this.ollama.create({ ...this.modelRequest, stream: false });

    return Promise.resolve();
  }

  public async reformuler(projet: Projet, questionsReponses: QuestionReponse[]): Promise<Projet> {
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
          content: user(projet, questionsReponses)
        }
      ]
    });

    projet.reformuler(content);

    await this.projetRepository.update(projet);

    return Promise.resolve(projet);
  }
}

export const reformulationService = new ReformulationService(
  ollama,
  createModelRequest('questions-agent', 'qwen2.5:14b', system),
  projetRepository
);
