import { z } from 'zod';
import { ApiError } from '../errors/api-error';
export const validateSchema = <TInput>(
  schema: z.Schema<TInput>,
  data: any
): TInput => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw ApiError.ZodValidationError(result.error);
  }
  return result.data;
};
