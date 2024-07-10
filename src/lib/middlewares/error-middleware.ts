import { ApiError, DataBaseError, InternalError } from '#/lib/errors/api-error';
import { CONFIG } from '#config';
import { NextFunction, Request, Response } from 'express';

export function ErrorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let message = 'Internal Error';
  let status: number = 500;

  if (error instanceof ApiError) {
    status = error.status;
    if (CONFIG.NODE_ENV !== 'production') {
      message = error.message;
    } else if (
      !(error instanceof DataBaseError) &&
      !(error instanceof InternalError)
    ) {
      message = error.message;
    }
  }
  if (CONFIG.NODE_ENV !== 'production') {
    if (error instanceof ApiError) console.error('Operational error: ', error);
    else console.error('Non-operational error: ', error);
  }

  return res.status(status).json({
    status,
    message,
    timestamp: Date.now(),
  });
}
