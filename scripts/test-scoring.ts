import './loadEnv';
import { aideRepository } from '@/infra/repositories/aide.repository';
import { notationAideService } from '@/infra/services/notation-aide-service';
import { Projet } from '@/domain/models/projet';

(async () => {
  const aide = await aideRepository.fromId(1094);
  const note = await notationAideService.noterAide(
    aide,
    Projet.create(
      'Modernisation des réseaux d’eau potable Réfection de la chaussée de la départementale Création d’une voie douce Réfection du parking de la mairie Création d’espaces verts Renaturation et mise au jour du ruisseau Réfection du parking du coworking Mise en valeur et réfection du monument aux morts, de la chapelle et du balcon de la mairie Création de jardins de pluie, de puits d’infiltration et désimperméabilisation maximale du secteur'
    )
  );

  console.log(note);
})();
