import { z, ZodIssue } from 'zod';

export class ApiError extends Error {
  status: number;
  cause?: unknown;

  constructor(status: number, message: string, cause?: unknown) {
    super(message);
    this.status = status;
    this.cause = cause;
  }
}
export class ValidationError extends ApiError {
  constructor(cause?: unknown) {
    super(400, 'Validation Error', cause);
  }
}
export class BadRequestError extends ApiError {
  constructor(message: string, cause?: unknown) {
    super(400, message, cause);
  }
}
export class DataBaseError extends ApiError {
  constructor(message: string, cause?: unknown) {
    super(500, message, cause);
  }
}
export class InternalError extends ApiError {
  constructor(message: string, cause?: unknown) {
    super(500, message, cause);
  }
}
