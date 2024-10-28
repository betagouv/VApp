'use server';

import { Projet } from '@/domain/models/projet';
import { Aide } from '@/domain/models/aide';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { poserQuestionUsecase } from '@/infra/uscases';

export async function poserQuestionAction(projetUuid: Projet['uuid'], aideUuid: Aide['uuid']) {
  const projet = await projetRepository.fromUuid(projetUuid);
  const aide = await aideRepository.fromUuid(aideUuid);
  return await poserQuestionUsecase.execute(projet, aide);
}
