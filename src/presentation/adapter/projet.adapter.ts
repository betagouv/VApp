import { TypedFormData } from '@/libs/utils/types';
import { Projet } from '@/domain/models/projet';
import { NouveauProjetFormDto, nouveauProjetFormDtoSchema } from '@/presentation/dtos/nouveau-projet-form.dto';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';

function toArrayOrUndefined<T>(data?: unknown | unknown[]): T[] | undefined {
  if (typeof data === 'undefined') {
    return;
  }

  if (Array.isArray(data)) {
    return data as T[];
  } else {
    return [data as T];
  }
}

export class ProjetAdapter {
  // @ts-expect-error something to do with TypedFormData
  static adaptFromNouveauProjetFormData(nouveauProjetFormData: TypedFormData<NouveauProjetFormDto>): Projet {
    const data = nouveauProjetFormDtoSchema.parse(nouveauProjetFormData);

    return Projet.create(data.description, [], {
      aideNatures: toArrayOrUndefined<AtAidTypeGroup>(data.aideNatures),
      actionsConcernees: toArrayOrUndefined(data.actionsConcernees),
      etatsAvancements: toArrayOrUndefined(data.etatsAvancements),
      beneficiaire: data.audience,
      payante: data.payante === 'true' ? true : data.payante === 'false' ? false : undefined,
      territoireId: data.territoireId
    });
  }
}
