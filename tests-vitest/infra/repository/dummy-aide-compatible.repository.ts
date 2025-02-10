import { PaginatedResult, Pagination } from '@/libs/pagination';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { AideScoreRepositoryInterface } from '@/domain/repositories/aide-score-repository.interface';
import aides from './aides.json';

export class DummyAideCompatibleRepository implements AideScoreRepositoryInterface {
  constructor(public aides: Aide[] = []) {}

  public all() {
    return Promise.resolve(this.aides.map(({ id }, i) => new AideScore(i, id)));
  }

  public size() {
    return Promise.resolve(this.aides.length);
  }

  public findAllFor() {
    return this.all();
  }

  async *findAllAsyncForProjet(
    projet: Projet,
    criteres: CriteresRechercheAide,
    chunkSize?: number
  ): AsyncGenerator<AideScore> {
    return undefined;
  }

  async findAllPaginatedForProjet(projet: Projet, { page, limit }: Pagination): Promise<PaginatedResult<AideScore>> {
    const aidesCompatibles = await this.all();
    return Promise.resolve({
      data: aidesCompatibles,
      totalItems: aidesCompatibles.length,
      lastPage: 1,
      currentPage: page || 1
    });
  }
}

// @ts-ignore
export const dummyAideCompatibleRepository = new DummyAideCompatibleRepository(aides);
