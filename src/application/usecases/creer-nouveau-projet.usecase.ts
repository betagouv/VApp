import { UUID } from 'short-uuid';
import { UsecaseInterface } from '@/application/usecases/usecase.interface';
import { Projet } from '@/domain/models/projet';
import { ProjetRepositoryInterface } from '@/domain/repositories/projet.repository.interface';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { ZoneGeographiqueRepositoryInterface } from '@/domain/repositories/zone-geographique-repository.interface';
import { ZoneGeographiqueIntrouvableError } from '@/application/errors/zone-geographique-introuvable.error';
import { AtPerimeterScale } from '@/infra/at/perimeter';
import { ProjetExisteDejaError } from '@/application/errors/projet-existe-deja.error';

export type ZoneGeographiqueQuery = {
  type: AtPerimeterScale;
  code: string;
};

export type CreerNouveauProjetUsecaseInput = {
  uuid?: UUID;
  description: string;
  porteur: AtOrganizationTypeSlug;
  etatAvancement?: LesCommunsProjetStatuts;
  zoneGeographiqueQueries: ZoneGeographiqueQuery[];
  clientId: UUID;
};

export class CreerNouveauProjetUsecase implements UsecaseInterface {
  constructor(
    public projetRepository: ProjetRepositoryInterface,
    public zoneGeographiqueRepository: ZoneGeographiqueRepositoryInterface
  ) {}

  public async execute({
    uuid,
    description,
    porteur,
    etatAvancement,
    zoneGeographiqueQueries,
    clientId
  }: CreerNouveauProjetUsecaseInput): Promise<Projet> {
    if (uuid) {
      const existingProjet = await this.projetRepository.findOneById(uuid);
      if (existingProjet !== null) {
        throw new ProjetExisteDejaError(`Un projet portant l'identifiant ${uuid} existe déjà.`);
      }
    }

    const zoneGeographiques = await Promise.all(
      zoneGeographiqueQueries.map(async ({ code, type }) => {
        const zoneGeographique = await this.zoneGeographiqueRepository.findOneByTypeAndCode(type, code);
        if (!zoneGeographique) {
          throw new ZoneGeographiqueIntrouvableError(`Aucun(e)s ${type} portant le code ${code} n'a été trouvée.`);
        }
        return zoneGeographique;
      })
    );

    const projet = Projet.create(description, porteur, etatAvancement, zoneGeographiques, new Map(), clientId, uuid);
    await this.projetRepository.add(projet);

    return projet;
  }
}
