import { Ollama, Options } from 'ollama';
import { NotationAideServiceInterface } from '@/domain/services/notation-aide.service.interface';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { assertValid, isNote } from '@/domain/note';
import { getModelConfiguration, ModelConfiguration, ollama } from '@/infra/ollama';
import { system, user } from '@/infra/prompts/notation';
import { OllamaServiceInterface } from '@/infra/services/ollama-service.interface';

export class NotationAideService implements NotationAideServiceInterface, OllamaServiceInterface {
  private initialized: boolean = false;
  static MIN_NB_NOTES_REQUIRED = 4;
  static MAX_ATTEMPT = 12;
  static EXTRACT_NOTE_REGEX = /(-? ?[0-9]).*/;

  constructor(
    private ollama: Ollama,
    private modelConfiguration: ModelConfiguration
  ) {}

  public async initialize() {
    console.log(`Initializing ${this.getModelName()} from ${this.getModelFrom()}...`);
    this.initialized = true;

    return Promise.resolve();
  }

  public async noterAide(aide: Aide, projet: Projet): Promise<number> {
    if (!this.initialized) {
      await this.initialize();
    }

    const notes = [];
    let attempt = 0;
    for (
      attempt;
      attempt < NotationAideService.MAX_ATTEMPT && notes.length < NotationAideService.MIN_NB_NOTES_REQUIRED;
      attempt++
    ) {
      const note = await this.attemptNoterAide(aide, projet, attempt + 1);
      if (isNote(note)) {
        notes.push(note);
      }
    }

    if (notes.length < NotationAideService.MIN_NB_NOTES_REQUIRED) {
      throw new Error(
        `Malgrès ${attempt} tentatives, seulement ${notes.length} notes sur les ${NotationAideService.MIN_NB_NOTES_REQUIRED} requises pour l'aide "${aide.nom}" portant l'uuid ${aide.uuid}.`
      );
    }

    return notes.reduce((a, b) => a + b, 0) / notes.length;
  }

  private async attemptNoterAide(aide: Aide, projet: Projet, seed: number): Promise<number | null> {
    try {
      const { response } = await this.ollama.generate({
        model: this.getModelFrom(),
        system,
        options: this.getRequestOptions({
          num_ctx: 16384,
          num_predict: 2,
          seed: seed + NotationAideService.MIN_NB_NOTES_REQUIRED
        }),
        prompt: user(aide, projet),
        stream: false
      });

      const matches = response.trim().match(NotationAideService.EXTRACT_NOTE_REGEX);
      const note = matches ? Number(matches[1]) : null;
      assertValid(note, `La réponse suivante n'est pas attribuable à une note: ${response}`);

      return Promise.resolve(note);
    } catch (e: unknown) {
      console.error(e);
      return Promise.resolve(null);
    }
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

export const notationAideService = new NotationAideService(
  ollama,
  getModelConfiguration('notation-agent', 'llama3.2:1b', system)
);
