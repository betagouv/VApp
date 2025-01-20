'use server';

import { isZodError, zodErrorToMessage } from '@/libs/utils/zod';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { projetDescriptionFormDtoSchema } from '@/presentation/dtos/projet-description-form.dto';
import { ProjetDescriptionFormState } from '@/components/forms/ProjetDescriptionForm';

export async function editerProjetDescriptionAction(prevState: ProjetDescriptionFormState, formData: FormData) {
  try {
    const projetDescriptionFormDto = projetDescriptionFormDtoSchema.parse(formData);
    const projet = await projetRepository.fromUuid(projetDescriptionFormDto.uuid);
    projet.reformuler(projetDescriptionFormDto.description);
    await projetRepository.save(projet);

    return { message: 'La description du projet a été reformulée.', isValid: true };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de reformuler le projet.';
    if (isZodError(e)) {
      message = zodErrorToMessage(e);
    }

    return { message, isValid: false };
  }
}
