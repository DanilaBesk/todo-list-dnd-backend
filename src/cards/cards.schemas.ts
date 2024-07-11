import { FlattenSchemaTypes } from '#/lib/type-utils';
import { z } from 'zod';

export const STATUS = z.enum(['TODO', 'DOING', 'DONE']);
export const ID = z.string({ required_error: 'Id is required' });
export const TITLE = z
  .string({
    required_error: 'Title is required',
  })
  .min(1)
  .max(255, 'Title is long');
export const DESCRIPTION = z.string().nullable();
export const ORDER = z.number().gte(1);

export const CreateCardSchema = z.object({
  body: z.object({
    title: TITLE,
    status: STATUS,
  }),
});
export type TCreateCard = FlattenSchemaTypes<typeof CreateCardSchema>;

export const UpdateCardSchema = z.object({
  body: z.object({
    title: TITLE,
    description: DESCRIPTION,
  }),
  params: z.object({
    id: ID,
  }),
});
export type TUpdateCard = FlattenSchemaTypes<typeof UpdateCardSchema>;

export const UpdateCardOrderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: ID,
        status: STATUS,
        order: ORDER,
      })
    ),
  }),
});
export type TUpdateCardOrder = FlattenSchemaTypes<typeof UpdateCardOrderSchema>;

export const DeleteCardSchema = z.object({
  params: z.object({
    id: ID,
  }),
});
export type TDeleteCard = FlattenSchemaTypes<typeof DeleteCardSchema>;
