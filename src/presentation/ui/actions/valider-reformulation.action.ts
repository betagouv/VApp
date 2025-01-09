'use server';

import { SUUID } from 'short-uuid';

import { isValidationError } from '@/libs/validation';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { reformulationFormDtoSchema } from '@/presentation/ui/dtos/reformulation-form.dto';
import { ReformulationFormState } from '@/presentation/ui/components/forms/ReformulationForm';

export async function validerReformulationAction(prevState: ReformulationFormState, formData: FormData) {
  try {
    const data = reformulationFormDtoSchema.parse(formData);
    const projet = await projetRepository.fromSuuid(data.projetId as SUUID);
    projet.reformuler(data.reformulation);
    await projetRepository.save(projet);

    return { message: 'La description du projet a été reformulée.', isValid: true };
  } catch (e) {
    let message = 'Impossible de reformuler le projet.';
    if (isValidationError(e)) {
      message = e.message;
    }

    return { message, isValid: false };
  }
}
