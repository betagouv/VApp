import { ViewAideCompatibleDto } from '@/presentation/ui/dtos/view-aide-compatible.dto';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { AideScore } from '@/domain/models/aide-score';

export class AideCompatibleAdapter {
  public constructor(public aideRepository: AideRepositoryInterface) {}

  async toViewAideCompatible({ aideId, scoreCompatibilite }: AideScore): Promise<ViewAideCompatibleDto> {
    const aide = await this.aideRepository.fromId(aideId);
    return {
      aide: { ...aide },
      scoreCompatibilite: scoreCompatibilite
    };
  }
}
