import { aideRepository } from '@/infra/repositories/aide.repository';
import { ViewAideEligible } from '@/presentation/dtos/view-aide-eligible';
import { AideRepositoryInterface } from '@/domain/repositories/aide.repository.interface';
import { AideEligible } from '@/domain/models/aide-eligible';

export class AideEligibleAdapter {
  public constructor(public aideRepository: AideRepositoryInterface) {}

  async toViewAideEligible({ aideId, eligibilite }: AideEligible): Promise<ViewAideEligible> {
    const aide = await this.aideRepository.fromUuid(aideId);
    return {
      aide: { ...aide },
      eligibilite
    };
  }
}

export const aideEligibleAdapter = new AideEligibleAdapter(aideRepository);
