import { TypedFormData } from '@/libs/utils/types';
import { Projet } from '@/domain/models/projet';
import { NouveauProjetFormDto, nouveauProjetFormDtoSchema } from '@/presentation/dtos/nouveau-projet-form.dto';
import { AtAidTypeGroupType } from '@/infra/at/aid-type-group';
import { Beneficiaire } from '@/domain/models/beneficiaire';

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
  //   formData FormData {
  //   '$ACTION_REF_1': '',
  //   '$ACTION_1:0': '{"id":"097ca5d3beaadd9903265ad97516011b61c7ccb9","bound":"$@1"}',
  //   '$ACTION_1:1': '[{"message":"","uuid":"$undefined"}]',
  //   '$ACTION_KEY': 'k3845830098',
  //   description: 'afzzdazad',
  //   audience: 'association',
  //   territoire: 'Villeurbanne (Commune - 69100)',
  //   territoireId: '98585-villeurbanne',
  //   payante: 'false',
  //   aid_type_group_slug: 'financial-group',
  //   aid_step_slugs: [ 'preop', 'op' ],
  //   aid_destination_slugs: [ 'preop', 'postop' ]
  // }

  // @ts-expect-error smthing with TypedFormData
  static adaptFromNouveauProjetFormData(nouveauProjetFormData: TypedFormData<NouveauProjetFormDto>): Projet {
    const data = nouveauProjetFormDtoSchema.parse(Object.fromEntries(nouveauProjetFormData.entries()));
    return Projet.create(data.description, [], {
      aideNatures: toArrayOrUndefined<AtAidTypeGroupType>(data.aideNatures),
      actionsConcernees: toArrayOrUndefined(data.actionsConcernees),
      etatsAvancements: toArrayOrUndefined(data.etatsAvancements),
      beneficiaire: data.audience as Beneficiaire,
      payante: data.payante === 'true' ? true : data.payante === 'false' ? false : undefined,
      territoireId: data.territoireId
    });
  }
}
