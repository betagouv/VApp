import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { AideId, AideInterface } from '@/domain/models/aide.interface';
import { Projet } from '@/domain/models/projet';

export interface AideRepositoryInterface {
  all(): Promise<AideInterface[]>;
  findAllForProjet(projet: Projet, criteresRechercheAide: CriteresRechercheAide): Promise<AideInterface[]>;
  findOneById(id: AideId): Promise<AideInterface | null>;
  fromId(id: AideId): Promise<AideInterface>;
  size(): Promise<number>;
}
