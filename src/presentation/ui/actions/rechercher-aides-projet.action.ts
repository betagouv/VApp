'use server';

import { createStreamableValue } from 'ai/rsc';
import { revalidatePath } from 'next/cache';
import { UUID } from 'short-uuid';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { CriteresRechercheAidesDto } from '@/presentation/api/dtos/criteres-recherche-aides.dto';
import { rechercherAidesScoresUsecase, aideCompatibleAdapter } from '@/container';
import { isViewAideEvaluee, ViewAideEvalueeDto } from '@/presentation/ui/dtos/view-aide-evaluee.dto';

export async function rechercherAidesProjetAction(projetId: UUID, criteres?: CriteresRechercheAidesDto) {
  const projet = await projetRepository.fromUuid(projetId);
  const stream = createStreamableValue<ViewAideEvalueeDto>();

  (async () => {
    const generator = await rechercherAidesScoresUsecase.execute(projet, criteres);
    for await (const aideScore of generator) {
      const viewAideCompatible = await aideCompatibleAdapter.toViewAideCompatible(aideScore);
      if (isViewAideEvaluee(viewAideCompatible)) {
        stream.update(viewAideCompatible);
        projet.addScore(aideScore);
        await projetRepository.save(projet);
      }
    }

    revalidatePath(`/projets/${projet.uuid}`);
    stream.done();
  })();

  return stream.value;
}
