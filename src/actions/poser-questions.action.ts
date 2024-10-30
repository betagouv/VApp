'use server';

import { Projet } from '@/domain/models/projet';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { poserQuestionUsecase } from '@/infra/uscases';

export async function poserQuestionAction(projetUuid: Projet['uuid']) {
  const projet = await projetRepository.fromUuid(projetUuid);
  const aides = await Promise.all(projet.aidesEligibles.map(({ aideId }) => aideRepository.fromUuid(aideId)));
  return await poserQuestionUsecase.execute(projet, aides.slice(0, 3));
}
