import { z } from 'zod';
import { ApiError } from './errors/api-error';

export const validateSchema = <TInput, TOutput>(
  schema: z.Schema<TInput>,
  data: unknown
): TInput => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw ApiError.ZodValidationError(result.error);
  }
  return result.data;
};
