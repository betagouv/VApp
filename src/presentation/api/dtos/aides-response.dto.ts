import { z } from '@/libs/validation';
import { aideEvalueeDtoSchema } from '@/presentation/api/dtos/aide.dto';
import { JsonAPICollectionLinksSchema } from '@/presentation/api/json-api/links';
import { JsonAPIMetaSchema } from '@/presentation/api/json-api/meta';

export const aidesResponseDtoSchema = z.object({
  data: z.array(aideEvalueeDtoSchema),
  links: JsonAPICollectionLinksSchema,
  meta: JsonAPIMetaSchema
});

export type AidesResponseDto = z.infer<typeof aidesResponseDtoSchema>;
