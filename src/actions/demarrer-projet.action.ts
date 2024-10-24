'use server';

import { revalidatePath } from 'next/cache';
import { TypedFormData } from '@/libs/utils/types';
import { demarrerProjetUsecase } from '@/infra/uscases';
import { isZodError } from '@/libs/utils/zod';
import { NouveauProjetFormDto } from '@/presentation/dtos/nouveau-projet-form.dto';
import { ProjetAdapter } from '@/presentation/adapter/projet.adapter';

export async function demarrerProjetAction(
  prevState: {
    message: string;
    uuid?: string;
  },
  formData: FormData
) {
  try {
    const projet = ProjetAdapter.adaptFromNouveauProjetFormData(
      formData as unknown as TypedFormData<NouveauProjetFormDto>
    );
    await demarrerProjetUsecase.execute(projet);

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
