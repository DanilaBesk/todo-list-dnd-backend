import { z } from 'zod';

const STATUS = z.enum(['TODO', 'DOING', 'DONE']);
const ID = z.string({ required_error: 'id is required' });

export const createCardSchema = z.object({
  title: z
    .string({
      required_error: 'title is required',
    })
    .min(1)
    .max(255, 'title is long'),
  status: STATUS,
});

export const updateCardSchema = z.object({
  id: ID,
  title: z
    .string({
      required_error: 'title is required',
    })
    .min(1)
    .max(255, 'title is long')
    .optional(),
  description: z.string().optional(),
  status: STATUS.optional(),
});

export const updateCardOrderSchema = z.object({
  items: z.array(
    z.object({
      id: ID,
      status: STATUS,
      order: z.number(),
    })
  ),
});

export const deleteCardSchema = z.object({
  id: ID,
});
