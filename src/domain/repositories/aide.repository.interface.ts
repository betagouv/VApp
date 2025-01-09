import { SUUID, UUID } from 'short-uuid';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';
import { Aide } from '@/domain/models/aide';
import { Projet } from '@/domain/models/projet';

export interface AideRepositoryInterface {
  all(): Promise<Aide[]>;
  findAllForProjet(projet: Projet, criteresRechercheAide: CriteresRechercheAide): Promise<Aide[]>;
  fromId(atId: Aide['atId']): Promise<Aide>; // AT id
  fromUuid(uuid: UUID): Promise<Aide>;
  fromSuuid(suuid: SUUID): Promise<Aide>;
  size(): Promise<number>;
}
