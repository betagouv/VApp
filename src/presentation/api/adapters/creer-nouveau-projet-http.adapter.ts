import { UUID } from 'short-uuid';
import { CreerProjetDto } from '@/presentation/api/dtos/creer-projet.dto';
import {
  CreerNouveauProjetUsecaseInput,
  ZoneGeographiqueQuery
} from '@/application/usecases/creer-nouveau-projet.usecase';
import { Projet } from '@/domain/models/projet';
import { getProjetAidesRelativeLink, getWidgetProjetAidesLink } from '@/presentation/api/contracts/aides-contract';
import { ProjetResponseDto } from '@/presentation/api/dtos/projet-response.dto';

export class CreerNouveauProjetHttpAdapter {
  static toInput(
    { description, zonesGeographiques, porteur, etatAvancement }: CreerProjetDto,
    clientId: string
  ): CreerNouveauProjetUsecaseInput {
    const zoneGeographiqueQueries: ZoneGeographiqueQuery[] = zonesGeographiques
      ? zonesGeographiques.map(({ type, code }) => ({ type, code: String(code) }))
      : [];

    return {
      description,
      zoneGeographiqueQueries,
      porteur,
      etatAvancement,
      clientId: clientId as UUID
    };
  }

  static toProjetResponseDto(projet: Projet): ProjetResponseDto {
    return {
      data: {
        id: projet.uuid,
        description: projet.description,
        porteur: projet.porteur,
        zonesGeographiques: projet.zonesGeographiques.map(({ type, code }) => ({ type, code: Number(code) })),
        etatAvancement: projet.etatAvancement,
        clientId: projet.clientId
      },
      links: {
        widget: getWidgetProjetAidesLink(projet),
        aides: getProjetAidesRelativeLink(projet)
      }
    };
  }
}
