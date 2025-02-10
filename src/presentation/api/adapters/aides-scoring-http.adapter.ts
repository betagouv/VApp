import { UUID } from 'short-uuid';
import { AideMapper } from '@/infra/mappers/aide.mapper';
import { Projet } from '@/domain/models/projet';
import { AideScore } from '@/domain/models/aide-score';
import { AidesScoringUsecaseInput } from '@/application/usecases/aides-scoring.usecase';
import { AidesScoringResponseDto } from '@/presentation/api/dtos/aides-scoring-response.dto';
import { RequiredScoringFieldsDto } from '@/presentation/api/dtos/aides-scoring-request.dto';

export class AidesScoringHttpAdapter {
  static toInput(projetId: string, aidesDtos: RequiredScoringFieldsDto[], clientId: string): AidesScoringUsecaseInput {
    return {
      projetId: projetId as Projet['uuid'],
      aides: aidesDtos.map(AideMapper.fromRequiredScoringFieldsDto),
      clientId: clientId as UUID
    };
  }

  static toJsonApiResponse(aidesScores: AideScore[]): AidesScoringResponseDto {
    return {
      data: aidesScores.map(({ aideId, scoreCompatibilite }) => ({ id: aideId, scoreCompatibilite }))
    };
  }
}
