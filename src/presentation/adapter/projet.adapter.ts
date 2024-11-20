import { TypedFormData } from '@/libs/utils/types';
import { Projet } from '@/domain/models/projet';
import { NouveauProjetFormDto, nouveauProjetFormDtoSchema } from '@/presentation/dtos/nouveau-projet-form.dto';

export class ProjetAdapter {
  // @ts-expect-error smthing with TypedFormData
  static adaptFromNouveauProjetFormData(nouveauProjetFormData: TypedFormData<NouveauProjetFormDto>): Projet {
    const data = nouveauProjetFormDtoSchema.parse(Object.fromEntries(nouveauProjetFormData.entries()));
    return Projet.create(data.description, [], {
      aideNatures: data.aideNatures,
      actionsConcernees: data.actionsConcernees,
      etatsAvancements: data.etatsAvancements,
      beneficiaire: data.audience,
      payante: data.payante === 'true' ? true : data.payante === 'false' ? false : undefined,
      territoireId: data.territoireId
    });
  }
}
