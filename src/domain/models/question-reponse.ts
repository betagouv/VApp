import { Question } from '@/domain/models/question';
import { Reponse } from '@/domain/models/reponse';

export class QuestionReponse {
  constructor(
    public question: Question,
    public reponse: Reponse
  ) {}
}
