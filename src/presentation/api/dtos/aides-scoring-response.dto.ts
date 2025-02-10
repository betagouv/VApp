import { z } from '@/libs/validation';
import { aideScoreDtoSchema } from '@/presentation/api/dtos/aide-score.dto';

export const aidesScoringResponseDtoSchema = z.object({
  data: z.array(aideScoreDtoSchema)
});

export type AidesScoringResponseDto = z.infer<typeof aidesScoringResponseDtoSchema>;
