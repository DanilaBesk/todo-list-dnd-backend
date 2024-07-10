import { Prisma } from '@prisma/client';
import { DataBaseError } from '#/lib/errors/api-error';

function handlePrismaError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    throw new DataBaseError(`Prisma error: ${error.message}`, error);
  } else {
    throw error;
  }
}

export { handlePrismaError };
