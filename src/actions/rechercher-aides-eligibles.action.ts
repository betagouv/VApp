'use server';

import { createStreamableValue } from 'ai/rsc';
import { revalidatePath } from 'next/cache';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { rechercherAidesEligiblesUsecase } from '@/infra/uscases';
import { aideEligibleAdapter } from '@/presentation/adapter/aide-eligible.adapter';
import { ViewAideEligible } from '@/presentation/dtos/view-aide-eligible';

export async function rechercherAidesEligiblesAction(projetId: string) {
  const projet = await projetRepository.fromUuid(projetId);
  const stream = createStreamableValue<ViewAideEligible>();

  (async () => {
    const generator = await rechercherAidesEligiblesUsecase.execute(projet);

    for await (const aideEligible of generator) {
      const viewAideEligible = await aideEligibleAdapter.toViewAideEligible(aideEligible);
      stream.update(viewAideEligible);
    }

    revalidatePath(`/projets/${projet.uuid}`);
    stream.done();
  })();

  return stream.value;
}
