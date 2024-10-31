'use server';

import { isZodError } from '@/libs/utils/zod';
import { repondreQuestionsUsecase } from '@/infra/uscases';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { questionsFormDtoSchema } from '@/presentation/dtos/questions-form.dto';

export async function repondreQuestionAction(
  prevState: {
    message: string;
    uuid?: string;
  },
  formData: FormData
) {
  try {
    const data = questionsFormDtoSchema.parse(formData);
    const projet = await projetRepository.fromUuid(data.projetId);
    await repondreQuestionsUsecase.execute(projet, data.questionsReponses);

    // [`/projets/${projet.uuid}`].forEach((path) => revalidatePath(path));

    return { message: 'La description du projet a été reformulée.', uuid: projet.uuid };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de reformuler le projet.';
    if (isZodError(e)) {
      message = e.message;
    }

    return { message };
  }
}
