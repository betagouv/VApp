import { Question } from '@/domain/models/question';

export class Recommendation {
  constructor(
    public eligibilite: number,
    public aideId: string,
    public questions: Question[] = []
  ) {}
}
