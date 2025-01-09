import { AideScore } from '@/domain/models/aide-score';
import { Question } from '@/domain/models/question';
import { Reponse } from '@/domain/models/reponse';
import { SUUID } from 'short-uuid';

export type FormulePar = 'utilisateur' | 'assistant';

export class Version {
  constructor(
    public readonly uuid: SUUID,
    public readonly description: string,
    public readonly aidesCompatibles: AideScore[],
    public readonly formuleLe: Date,
    public readonly formulePar: FormulePar,
    public readonly questions: Question[],
    public readonly reponses: Reponse[]
  ) {}
}
