import { TypedFormData } from '@/libs/utils/types';
import { Projet } from '@/domain/models/projet';
import { NouveauProjetFormDto, nouveauProjetFormDtoSchema } from '@/presentation/dtos/nouveau-projet-form.dto';

export class ProjetAdapter {
  static adaptFromNouveauProjetFormData(nouveauProjetFormData: TypedFormData<NouveauProjetFormDto>): Projet {
    const data = nouveauProjetFormDtoSchema.parse(Object.fromEntries(nouveauProjetFormData.entries()));
    return Projet.create(data.description);
  }
}
