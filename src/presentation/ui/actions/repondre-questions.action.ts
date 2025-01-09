'use server';

import { SUUID } from 'short-uuid';
import { isValidationError } from '@/libs/validation';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { questionsFormDtoSchema } from '@/presentation/ui/dtos/questions-form.dto';
import { QuestionsProjetFormState } from '@/presentation/ui/components/forms/QuestionsProjetForm';

export async function repondreQuestionAction(prevState: QuestionsProjetFormState, formData: FormData) {
  try {
    const data = questionsFormDtoSchema.parse(formData);
    const projet = await projetRepository.fromSuuid(data.projetId as SUUID);

    return {
      message: 'La description du projet a été reformulée.',
      uuid: projet.suuid,
      questionsReponses: data.questionsReponses
    };
  } catch (e) {
    console.error(e);
    let message = 'Impossible de reformuler le projet.';
    if (isValidationError(e)) {
      message = e.message;
    }

    return { message };
  }
}
