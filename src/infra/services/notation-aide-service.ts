import { CreateRequest, Ollama } from 'ollama';
import { NotationAideServiceInterface } from '@/domain/services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { assertValid } from '@/domain/note';
import { createModelRequest, ollama } from '@/infra/ollama';
import { system, user } from '@/infra/prompts/notation';

export class NotationAideService implements NotationAideServiceInterface {
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

  public async noterAide(aide: Aide, projet: Projet): Promise<number> {
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
          content: user(aide, projet)
        }
      ]
    });

    const note = Number(content);
    assertValid(
      note,
      `La réponse suivante n'est pas attribuable à une note:
${content} `
    );

    return Promise.resolve(note);
  }
}

export const notationAideService = new NotationAideService(
  ollama,
  createModelRequest('notation-agent', 'llama3.2:1b', system)
);
