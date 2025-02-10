import { Aide } from '@/domain/models/aide';
import { RequiredScoringFieldsDto } from '@/presentation/api/dtos/aides-scoring-request.dto';

export class AideMapper {
  static fromRequiredScoringFieldsDto(requiredScoringFieldsDto: RequiredScoringFieldsDto): Aide {
    return new Aide(
      requiredScoringFieldsDto.id,
      requiredScoringFieldsDto.nom,
      requiredScoringFieldsDto.description,
      [],
      [],
      undefined,
      requiredScoringFieldsDto.fournisseurDonnees
    );
  }
}
