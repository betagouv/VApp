'use server';

import { createStreamableValue } from 'ai/rsc';

import { rechercherAidesEligiblesUsecase } from '@/infra/uscases';
import { aideEligibleAdapter } from '@/presentation/adapter/aide-eligible.adapter';
import { ViewAideEligible } from '@/presentation/dtos/view-aide-eligible';
import { Projet } from '@/domain/models/projet';
import { Territoire } from '@/domain/models/territoire';
import { territoireRepository } from '@/infra/repositories/territoire.repository';
import { projetRepository } from '@/infra/repositories/projet.repository';
import { AtAidTypeGroup } from '@/infra/at/aid-type-group';
import { AtOrganizationType } from '@/infra/at/organization-type';

export async function rechercherAidesCollectiviteAction({
  description,
  code
}: Pick<Projet, 'description'> & Pick<Territoire, 'code'>) {
  const territoire = await territoireRepository.findCommuneByCode(code);
  const projet = Projet.create(description, [], {
    payante: false,
    territoireId: territoire.aidesTerritoiresId,
    aideNatures: [AtAidTypeGroup.Financiere],
    beneficiaire: AtOrganizationType.Commune
  });
  await projetRepository.add(projet);

  const stream = createStreamableValue<ViewAideEligible>();

  (async () => {
    const generator = await rechercherAidesEligiblesUsecase.execute(projet);

    for await (const aideEligible of generator) {
      const viewAideEligible = await aideEligibleAdapter.toViewAideEligible(aideEligible);
      stream.update(viewAideEligible);
    }

    stream.done();
  })();

  return stream.value;
}
