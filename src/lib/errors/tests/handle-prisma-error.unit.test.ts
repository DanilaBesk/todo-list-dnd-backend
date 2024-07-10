import { Prisma } from '@prisma/client';
import { handlePrismaError } from '../handle-prisma-error';
import { DataBaseError } from '../api-error';

describe('handlePrismaError', () => {
  it('Should throw a DataBaseError for PrismaClientKnownRequestError', () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Test known error',
      { clientVersion: '1', code: '1' }
    );
    expect(() => handlePrismaError(prismaError)).toThrow(DataBaseError);
    expect(() => handlePrismaError(prismaError)).toThrow(
      'Prisma error: Test known error'
    );
  });

  it('Should throw a DataBaseError for PrismaClientUnknownRequestError', () => {
    const prismaError = new Prisma.PrismaClientUnknownRequestError(
      'Test unknown error',
      { clientVersion: '1' }
    );
    expect(() => handlePrismaError(prismaError)).toThrow(DataBaseError);
    expect(() => handlePrismaError(prismaError)).toThrow(
      'Prisma error: Test unknown error'
    );
  });

  it('Should throw a DataBaseError for PrismaClientValidationError', () => {
    const prismaError = new Prisma.PrismaClientValidationError(
      'Validation failed',
      { clientVersion: '1' }
    );
    expect(() => handlePrismaError(prismaError)).toThrow(DataBaseError);
    expect(() => handlePrismaError(prismaError)).toThrow(
      'Prisma error: Validation failed'
    );
  });

  it('Should rethrow other errors', () => {
    const unknownError = new Error('Unknown error');
    expect(() => handlePrismaError(unknownError)).toThrow(unknownError);
  });
});
