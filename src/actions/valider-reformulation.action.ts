'use server';

import { isZodError } from '@/libs/utils/zod';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { reformulationFormDtoSchema } from '@/presentation/dtos/reformulation-form.dto';
import { ReformulationFormState } from '@/components/forms/ReformulationForm';

export async function validerReformulationAction(prevState: ReformulationFormState, formData: FormData) {
  try {
    const data = reformulationFormDtoSchema.parse(formData);
    const projet = await projetRepository.fromUuid(data.projetId);
    projet.reformuler(data.reformulation);
    await projetRepository.save(projet);

    return { message: 'La description du projet a été reformulée.', isValid: true };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de reformuler le projet.';
    if (isZodError(e)) {
      message = e.message;
    }

    return { message, isValid: false };
  }
}
