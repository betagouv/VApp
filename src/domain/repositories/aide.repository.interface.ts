import { AideEntity } from '../entities/aide.entity';

export interface AideRepositoryInterface {
  getAll(): Promise<AideEntity[]>;
}
