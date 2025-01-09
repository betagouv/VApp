'use server';

import { SUUID } from 'short-uuid';
import { isValidationError, zodErrorToMessage } from '@/libs/validation';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { projetDescriptionFormDtoSchema } from '@/presentation/ui/dtos/projet-description-form.dto';
import { ProjetDescriptionFormState } from '@/presentation/ui/components/forms/ProjetDescriptionForm';

export async function editerProjetDescriptionAction(prevState: ProjetDescriptionFormState, formData: FormData) {
  try {
    const projetDescriptionFormDto = projetDescriptionFormDtoSchema.parse(formData);
    const projet = await projetRepository.fromSuuid(projetDescriptionFormDto.suuid as SUUID);
    projet.reformuler(projetDescriptionFormDto.description);
    await projetRepository.save(projet);

    return { message: 'La description du projet a été reformulée.', isValid: true };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de reformuler le projet.';
    if (isValidationError(e)) {
      message = zodErrorToMessage(e);
    }

    return { message, isValid: false };
  }
}
