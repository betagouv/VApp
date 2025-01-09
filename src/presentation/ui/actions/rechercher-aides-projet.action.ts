'use server';

import { createStreamableValue } from 'ai/rsc';
import { revalidatePath } from 'next/cache';
import { UUID } from 'short-uuid';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { CriteresRechercheAidesDto } from '@/presentation/api/dtos/criteres-recherche-aides.dto';
import { rechercherAidesScoresUsecase, aideCompatibleAdapter } from '@/container';
import { ViewAideCompatibleDto } from '@/presentation/ui/dtos/view-aide-compatible.dto';

export async function rechercherAidesProjetAction(projetId: UUID, criteres?: CriteresRechercheAidesDto) {
  const projet = await projetRepository.fromUuid(projetId);
  const stream = createStreamableValue<ViewAideCompatibleDto>();

  (async () => {
    const generator = await rechercherAidesScoresUsecase.execute(projet, criteres);
    for await (const aideScore of generator) {
      const viewAideCompatible = await aideCompatibleAdapter.toViewAideCompatible(aideScore);
      stream.update(viewAideCompatible);
      projet.addScore(aideScore);
      await projetRepository.save(projet);
    }

    revalidatePath(`/projets/${projet.uuid}`);
    stream.done();
  })();

  return stream.value;
}
