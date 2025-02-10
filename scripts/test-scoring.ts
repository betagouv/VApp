import './loadEnv';
import { aideRepository } from '@/infra/repositories/at-aide-repository';
import { aideScoringService } from '@/infra/ai/services/aide-scoring-service';
import { Projet } from '@/domain/models/projet';
import samples from '../data/project-description-sample.json';

(async () => {
  // @ts-expect-error key exists
  const projets = Object.keys(samples).map((nom) => Projet.create(samples[nom] as string));

  for (const projet of projets) {
    const aide = await aideRepository.fromId('1094');
    const note = await aideScoringService.attribuerScore(aide, projet);

    console.log(note);
  }
})();
