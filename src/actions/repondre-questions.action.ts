'use server';

import { revalidatePath } from 'next/cache';
import { isZodError } from '@/libs/utils/zod';
import { poserQuestionUsecase } from '@/infra/uscases';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { choisirAideFormDtoSchema } from '@/presentation/dtos/choisir-aide-form.dto';
import { aideRepository } from '@/infra/repositories/aide.repository';

export async function repondreQuestionAction(
  prevState: {
    message: string;
    uuid?: string;
  },
  formData: FormData
) {
  try {
    const data = choisirAideFormDtoSchema.parse(Object.fromEntries(formData.entries()));
    const projet = await projetRepository.fromUuid(data.projet_uuid);
    const aide = await aideRepository.fromUuid(data.aide_uuid);
    const questions = await poserQuestionUsecase.execute(projet, aide);

    revalidatePath('/');
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
