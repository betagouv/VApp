'use server';

import { createStreamableValue } from 'ai/rsc';

import { rechercherAidesScoresUsecase, aideCompatibleAdapter } from '@/container';
import { ViewAideCompatibleDto } from '@/presentation/ui/dtos/view-aide-compatible.dto';
import { Projet } from '@/domain/models/projet';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { AideScore } from '@/domain/models/aide-score';
import { atZoneGeographiqueRepository } from '@/infra/repositories/at-zone-geographique.repository';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';

export async function rechercherAidesCollectiviteAction({
  description,
  code
}: Pick<Projet, 'description'> & Pick<ZoneGeographique, 'code'>) {
  const territoire = await atZoneGeographiqueRepository.findCommuneByCode(code);
  const projet = Projet.create(description, AtOrganizationTypeSlug.Commune, LesCommunsProjetStatuts.IDEE, [territoire]);
  await projetRepository.add(projet);

  const stream = createStreamableValue<ViewAideCompatibleDto>();

  (async () => {
    const aidesScores: AideScore[] = [];
    const generator = await rechercherAidesScoresUsecase.execute(projet);

    for await (const aideCompatible of generator) {
      const viewAideCompatible = await aideCompatibleAdapter.toViewAideCompatible(aideCompatible);
      stream.update(viewAideCompatible);
      aidesScores.push(aideCompatible);
    }
    aidesScores.forEach((aideScore) => {
      projet.aidesScores.set(aideScore.aideId, aideScore);
    });
  })();

  return stream.value;
}
