import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';

import { Projet } from '@/domain/models/projet';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { ZoneGeographiqueRepositoryInterface } from '@/domain/repositories/zone-geographique-repository.interface';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

import { UsecaseInterface } from '@/application/usecases/usecase.interface';
import { ZoneGeographiqueIntrouvableError } from '@/application/errors/zone-geographique-introuvable.error';

export type DemarrerProjetUsecaseInput = {
  description: string;
  porteur: AtOrganizationTypeSlug;
  etatAvancement?: LesCommunsProjetStatuts;
  zoneGeographiqueIds: ZoneGeographique['id'][];
  criteresRechercheAide: CriteresRechercheAide;
};

export class DemarrerProjetUsecase implements UsecaseInterface {
  constructor(
    public projetRepository: ProjetRepositoryInterface,
    public zoneGeographiqueRepository: ZoneGeographiqueRepositoryInterface
  ) {}

  public async execute({
    description,
    porteur,
    etatAvancement,
    zoneGeographiqueIds,
    criteresRechercheAide
  }: DemarrerProjetUsecaseInput): Promise<Projet> {
    const zoneGeographiques = await Promise.all(
      zoneGeographiqueIds.map(async (id) => {
        const zoneGeographique = await this.zoneGeographiqueRepository.fromId(id);
        if (!zoneGeographique) {
          throw new ZoneGeographiqueIntrouvableError(`Aucun(e)s zone géographique portant l'id ${id} n'a été trouvée.`);
        }
        return zoneGeographique;
      })
    );

    const projet = Projet.create(description, porteur, etatAvancement, zoneGeographiques, new Map());
    projet.criteresRechercheAide = criteresRechercheAide;
    await this.projetRepository.add(projet);

    return projet;
  }
}
