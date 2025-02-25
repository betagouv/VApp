'use server';

import { isValidationError, zodErrorToMessage } from '@/libs/validation';
import { demarrerProjetUsecase } from '@/container';
import { TypedFormData } from '@/presentation/types';
import { NouveauProjetFormDto } from '@/presentation/ui/dtos/nouveau-projet-form.dto';
import { RechercherAidesFormState } from '@/presentation/ui/components/forms/RechercherAidesForm';
import { DemarrerProjetFormAdapter } from '@/presentation/ui/adapters/demarrer-projet-form.adapter';

export async function demarrerProjetAction(prevState: RechercherAidesFormState, formData: FormData) {
  try {
    const projet = await demarrerProjetUsecase.execute(
      DemarrerProjetFormAdapter.toInput(
        // @ts-expect-error smthing with TypedFormData
        formData as unknown as TypedFormData<NouveauProjetFormDto>
      )
    );

    return { message: 'Projet créé.', uuid: projet.suuid };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de créer le projet.';
    if (isValidationError(e)) {
      message = zodErrorToMessage(e);
    }

    return { message };
  }
}
