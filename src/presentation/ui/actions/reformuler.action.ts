'use server';

import { createStreamableValue } from 'ai/rsc';
import { SUUID } from 'short-uuid';

import { projetRepository } from '@/infra/repositories/projet.repository';
import { reformulationService } from '@/infra/ai/services/reformulation-service';
import { QuestionReponse } from '@/domain/models/question-reponse';

export async function reformulerAction(projetId: string, questionsReponses: QuestionReponse[]) {
  const projet = await projetRepository.fromSuuid(projetId as SUUID);

  const stream = createStreamableValue('');
  const streaming = createStreamableValue(true);

  (async () => {
    const response = await reformulationService.reformuler(projet, questionsReponses);
    for await (const part of response) {
      stream.append(part.response);
    }

    stream.done();
    streaming.done(false);
  })();

  return { response: stream.value, streaming: streaming.value };
}
