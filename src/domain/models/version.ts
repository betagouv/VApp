import { AideEligible } from '@/domain/models/aide-eligible';
import { Question } from '@/domain/models/question';
import { Reponse } from '@/domain/models/reponse';
import { SUUID } from 'short-uuid';

export type FormulePar = 'utilisateur' | 'assistant';

export class Version {
  constructor(
    public readonly uuid: SUUID,
    public readonly description: string,
    public readonly aidesEligibles: AideEligible[],
    public readonly formuleLe: Date,
    public readonly formulePar: FormulePar,
    public readonly questions: Question[],
    public readonly reponse: Reponse[]
  ) {}
}
