import { z } from 'zod';

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type FlattenSchemaTypes<T extends z.ZodTypeAny> = UnionToIntersection<
  z.infer<T>[keyof z.infer<T>]
>;
