'use server';

import { TypedFormData } from '@/libs/utils/types';
import { isZodError } from '@/libs/utils/zod';
import { demarrerProjetUsecase } from '@/infra/uscases';
import { NouveauProjetFormDto } from '@/presentation/dtos/nouveau-projet-form.dto';
import { ProjetAdapter } from '@/presentation/adapter/projet.adapter';
import { RechercherAidesFormState } from '@/components/forms/RechercherAidesForm';

export async function demarrerProjetAction(prevState: RechercherAidesFormState, formData: FormData) {
  try {
    console.log('formData', formData);
    const projet = ProjetAdapter.adaptFromNouveauProjetFormData(
      // @ts-expect-error smthing with TypedFormData
      formData as unknown as TypedFormData<NouveauProjetFormDto>
    );
    console.log('projet', projet);
    await demarrerProjetUsecase.execute(projet);

    return { message: 'Projet créé.', uuid: projet.uuid };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de créer le projet.';
    if (isZodError(e)) {
      message = e.message;
    }

    return { message };
  }
}
