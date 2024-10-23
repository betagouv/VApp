'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { DemarrerProjetUsecase } from '@/domain/usecases/demarrer-projet.usecase';
import { RechercherAidesUsecase } from '@/domain/usecases/rechercher-aides.usecase';
import { notationAideService } from '@/infra/ollama/notation-aide.service';
import { aideRepository } from '@/infra/repositories/aide.repository';

const demarrerProjetUsecase = new DemarrerProjetUsecase(
  new RechercherAidesUsecase(notationAideService, aideRepository),
  projetRepository
);

export async function demarrerProjet(
  prevState: {
    message: string;
    uuid?: string;
  },
  formData: FormData
) {
  const schema = z.object({
    description: z.string().min(1)
  });
  const parse = schema.safeParse({
    description: formData.get('description')
  });

  if (!parse.success) {
    return { message: 'Vous devez fournir une description de projet' };
  }

  const data = parse.data;

  try {
    const projet = await demarrerProjetUsecase.execute(data.description);

    revalidatePath('/');
    return { message: 'Projet créé', uuid: projet.uuid };
  } catch (e) {
    console.error(e);
    return { message: 'Impossible de créer le projet' };
  }
}
