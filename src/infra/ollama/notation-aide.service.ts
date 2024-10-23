import { CreateRequest, Ollama } from 'ollama';
import { modelRequest, ollama } from '@/infra/ollama/config';
import { NotationAideServiceInterface } from '@/domain/services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { assertValid } from '@/domain/note';

export class NotationAideService implements NotationAideServiceInterface {
  private initialized: boolean = false;

  constructor(
    private ollama: Ollama,
    private modelRequest: CreateRequest
  ) {}

  public async initialize() {
    console.log('initialize');
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
          content: `*Aide ou subvention à analyser :*
${aide.description}
____
*Projet de l'utilisateur :*
${projet.description}`
        }
      ]
    });

    const note = Number(content);
    assertValid(note);

    return Promise.resolve(note);
  }
}

export const notationAideService = new NotationAideService(ollama, modelRequest);
