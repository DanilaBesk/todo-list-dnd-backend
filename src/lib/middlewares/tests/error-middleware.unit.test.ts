import { ApiError, DataBaseError, InternalError } from '#/lib/errors/api-error';
import { ErrorMiddleware } from '#/lib/middlewares/error-middleware';
import { CONFIG } from '#config';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

describe('ErrorMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date());
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
    console.error = jest.fn();
  });

  describe('Should handle ApiError correctly', () => {
    it('Env development', () => {
      const error = new ApiError(400, 'Test ApiError');
      CONFIG.NODE_ENV = 'development';

      ErrorMiddleware(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith('Operational error: ', error);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Test ApiError',
        timestamp: Date.now(),
      });
    });
    it('Env test', () => {
      const error = new ApiError(400, 'Test ApiError');
      CONFIG.NODE_ENV = 'test';

      ErrorMiddleware(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith('Operational error: ', error);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Test ApiError',
        timestamp: Date.now(),
      });
    });

    it('Env production', () => {
      const error = new ApiError(400, 'Test ApiError');
      CONFIG.NODE_ENV = 'production';

      ErrorMiddleware(error, req, res, next);
      expect(console.error).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 400,
        message: 'Test ApiError',
        timestamp: Date.now(),
      });
    });
  });

  describe('Should handle DataBaseError and InternalError correctly', () => {
    it('Env development', () => {
      const causeDbError = new Prisma.PrismaClientKnownRequestError(
        'db error',
        { code: '1', clientVersion: '1' }
      );
      const dbError = new DataBaseError('Test DataBaseError', causeDbError);
      const internalError = new InternalError('Test InternalError');

      CONFIG.NODE_ENV = 'development';

      ErrorMiddleware(dbError, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Operational error: ',
        dbError
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Test DataBaseError',
        timestamp: Date.now(),
      });

      ErrorMiddleware(internalError, req, res, next);
      expect(console.error).toHaveBeenCalledWith(
        'Operational error: ',
        internalError
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Test InternalError',
        timestamp: Date.now(),
      });
    });
    it('Env test', () => {
      const causeDbError = new Prisma.PrismaClientKnownRequestError(
        'db error',
        { code: '1', clientVersion: '1' }
      );
      const dbError = new DataBaseError('Test DataBaseError', causeDbError);
      const internalError = new InternalError('Test InternalError');

      CONFIG.NODE_ENV = 'test';

      ErrorMiddleware(dbError, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Operational error: ',
        dbError
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Test DataBaseError',
        timestamp: Date.now(),
      });

      ErrorMiddleware(internalError, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Operational error: ',
        internalError
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Test InternalError',
        timestamp: Date.now(),
      });
    });
    it('Env production', () => {
      const causeDbError = new Prisma.PrismaClientKnownRequestError(
        'db error',
        { code: '1', clientVersion: '1' }
      );
      const dbError = new DataBaseError('Test DataBaseError', causeDbError);
      const internalError = new InternalError('Test InternalError');

      CONFIG.NODE_ENV = 'production';

      ErrorMiddleware(dbError, req, res, next);

      expect(console.error).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Error',
        timestamp: Date.now(),
      });

      ErrorMiddleware(internalError, req, res, next);
      expect(console.error).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Error',
        timestamp: Date.now(),
      });
    });
  });

  describe('Should log unexpected error', () => {
    it('Env development', () => {
      const error = new Error('Unexpected error');
      CONFIG.NODE_ENV = 'development';

      ErrorMiddleware(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Non-operational error: ',
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Error',
        timestamp: Date.now(),
      });
    });
    it('Env test', () => {
      const error = new Error('Unexpected error');
      CONFIG.NODE_ENV = 'test';

      ErrorMiddleware(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith(
        'Non-operational error: ',
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Error',
        timestamp: Date.now(),
      });
    });
    it('Env production', () => {
      const error = new Error('Unexpected error');
      CONFIG.NODE_ENV = 'production';

      ErrorMiddleware(error, req, res, next);

      expect(console.error).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal Error',
        timestamp: Date.now(),
      });
    });
  });
});
