import { ProjetEntity } from '../entities/projet.entity';
import { UsecaseInterface } from './usecase.interface';

export class DemarrerProjetUsecase implements UsecaseInterface {
  public execute(description: string = '') {
    return ProjetEntity.create(description);
  }
}
