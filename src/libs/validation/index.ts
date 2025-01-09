import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { isValidationError, zodErrorToMessage } from '@/libs/validation/is-validation-error';

extendZodWithOpenApi(z);

export { z, isValidationError, zodErrorToMessage };
