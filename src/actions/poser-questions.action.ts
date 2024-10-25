'use server';

import { revalidatePath } from 'next/cache';
import { isZodError } from '@/libs/utils/zod';

export async function poserQuestionAction(
  prevState: {
    message: string;
    uuid?: string;
  },
  formData: FormData
) {
  try {
    // const questions = await repondreQuestionUsecase.execute(projet, questions, reponses);
  } catch (e) {
    // console.error(e);
    // let message = 'Impossible de créer le projet.';
    // if (isZodError(e)) {
    //   message = e.message;
    // }
    //
    // return { message };
  }
}
