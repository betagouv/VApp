import { UUID } from 'short-uuid';
import { LcProjectDto } from '@/infra/les-communs/dtos/lc-project.dto';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { Projet } from '@/domain/models/projet';
import { ZoneGeographiqueRepositoryInterface } from '@/domain/repositories/zone-geographique-repository.interface';

export class ProjetMapper {
  public constructor(public zoneGeographiqueRepository: ZoneGeographiqueRepositoryInterface) {}

  async fromLesCommunsProjectDto(lcProjectDto: LcProjectDto): Promise<Projet> {
    const zonesGeographiques = lcProjectDto.communes
      ? await Promise.all(
          lcProjectDto.communes.map(({ inseeCode }) => {
            return this.zoneGeographiqueRepository.findCommuneByCode(inseeCode);
          })
        )
      : [];

    return new Projet(
      lcProjectDto.id as UUID,
      lcProjectDto.description,
      AtOrganizationTypeSlug.Commune,
      lcProjectDto.status,
      zonesGeographiques
    );
  }
}
