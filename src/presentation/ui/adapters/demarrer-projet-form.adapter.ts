import { TypedFormData } from '@/presentation/types';
import { DemarrerProjetUsecaseInput } from '@/application/usecases/demarrer-projet.usecase';
import { NouveauProjetFormDto, nouveauProjetFormDtoSchema } from '@/presentation/ui/dtos/nouveau-projet-form.dto';
import { EtatAvancementMapper } from '@/infra/mappers/etat-avancement.mapper';

export class DemarrerProjetFormAdapter {
  // @ts-expect-error something to do with TypedFormData
  static toInput(nouveauProjetFormData: TypedFormData<NouveauProjetFormDto>): DemarrerProjetUsecaseInput {
    const data = nouveauProjetFormDtoSchema.parse(nouveauProjetFormData);

    return {
      description: data.description,
      porteur: data.audience,
      etatAvancement: EtatAvancementMapper.fromAtToLesCommuns(data.etatAvancement),
      zoneGeographiqueIds: data.territoireId ? [data.territoireId] : []
    };
  }
}
