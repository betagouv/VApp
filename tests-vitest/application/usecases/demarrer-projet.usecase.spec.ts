import { it } from 'vitest';
import { dummyProjetRepository } from '../../infra/repository/dummy-projet.repository';
import { dummyZoneGeographiqueRepository } from '../../infra/repository/dummy-zone-geographique.repository';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { DemarrerProjetUsecase } from '@/application/usecases/demarrer-projet.usecase';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';

it('renders correctly', async () => {
  const demarrerProjetUsecase = new DemarrerProjetUsecase(dummyProjetRepository, dummyZoneGeographiqueRepository);
  await demarrerProjetUsecase.execute({
    description: 'Ammenager une piste cyclable',
    zoneGeographiqueIds: [],
    porteur: AtOrganizationTypeSlug.Commune,
    etatAvancement: LesCommunsProjetStatuts.IDEE
  });
});
