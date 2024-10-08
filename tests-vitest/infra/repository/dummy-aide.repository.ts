import { AideRepositoryInterface } from '../../../src/domain/repositories/aide.repository.interface';
import { AideEntity } from '../../../src/domain/entities/aide.entity';

export class DummyAideRepository implements AideRepositoryInterface {
  public getAll() {
    return Promise.resolve([
      AideEntity.create('Aide A'),
      AideEntity.create('Aide B'),
      AideEntity.create('Aide C'),
      AideEntity.create('Aide D')
    ]);
  }
}

export const dummyAideRepository = new DummyAideRepository();
