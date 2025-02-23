import './load-env-config';
import { getNbTokenRange } from '@/libs/env';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { AtOrganizationTypeSlug } from '@/infra/at/organization-type';
import { AtPerimeterScale } from '@/infra/at/perimeter';
import { Projet } from '@/domain/models/projet';
import { LesCommunsProjetStatuts } from '@/domain/models/les-communs/projet-statuts';
import { ZoneGeographique } from '@/domain/models/zone-geographique';
import { CriteresRechercheAide } from '@/domain/models/criteres-recherche-aide';

(async () => {
  const nbToken = getNbTokenRange();
  const zoneGeographique: ZoneGeographique = {
    type: AtPerimeterScale.commune,
    code: '69266',
    id: '98585-villeurbanne',
    nom: 'Villeurbanne',
    description: 'Villeurbanne'
  };
  const projetStatut: LesCommunsProjetStatuts = LesCommunsProjetStatuts.IDEE;
  const criteresRechercheAide: CriteresRechercheAide = {
    payante: false
  };

  console.log(`Projet :`);
  console.log(`- Etat d'avancement : ${projetStatut}`);
  console.log(`- Zone géographique : ${zoneGeographique.nom}`);
  console.log('Critères recherche :');
  console.log(criteresRechercheAide);
  console.log(`- tokens : ${nbToken[0]}-${nbToken[1]}`);

  console.log(`Nombres d'aides par type de porteur de projet :`);
  for (const porteur of Object.values(AtOrganizationTypeSlug)) {
    const projet = Projet.create('Lorem ipsum', porteur as AtOrganizationTypeSlug, projetStatut, [zoneGeographique]);
    const aides = await aideRepository.findAllForProjet(projet, criteresRechercheAide);
    console.log(`- "${porteur}" ${aides.length}`);
  }
})();
