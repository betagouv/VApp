'use server';

import { isZodError } from '@/libs/utils/zod';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { questionsFormDtoSchema } from '@/presentation/dtos/questions-form.dto';
import { QuestionsProjetFormState } from '@/components/forms/QuestionsProjetForm';

export async function repondreQuestionAction(prevState: QuestionsProjetFormState, formData: FormData) {
  try {
    const data = questionsFormDtoSchema.parse(formData);
    const projet = await projetRepository.fromUuid(data.projetId);

    return {
      message: 'La description du projet a été reformulée.',
      uuid: projet.uuid,
      questionsReponses: data.questionsReponses
    };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de reformuler le projet.';
    if (isZodError(e)) {
      message = e.message;
    }

    return { message };
  }
}
