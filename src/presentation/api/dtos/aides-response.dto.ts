import { z } from '@/libs/validation';
import { aideDtoSchema } from '@/presentation/api/dtos/aide.dto';
import { JsonAPICollectionLinksSchema } from '@/presentation/api/json-api/links';
import { JsonAPIMetaSchema } from '@/presentation/api/json-api/meta';

export const aidesResponseDtoSchema = z.object({
  data: z.array(aideDtoSchema),
  links: JsonAPICollectionLinksSchema,
  meta: JsonAPIMetaSchema
});
