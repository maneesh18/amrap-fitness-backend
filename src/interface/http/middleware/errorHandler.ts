import { Request, Response, NextFunction } from 'express';
import {
  DomainError,
  EntityNotFoundError,
  DuplicateEntityError,
  GymCapacityExceededError,
  MembershipAlreadyExistsError,
} from '../../../domain/errors/DomainError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof DomainError) {
    if (err instanceof EntityNotFoundError) {
      return res.status(404).json({
        error: err.name,
        message: err.message,
      });
    }

    if (err instanceof DuplicateEntityError) {
      return res.status(409).json({
        error: err.name,
        message: err.message,
      });
    }

    if (err instanceof GymCapacityExceededError) {
      return res.status(400).json({
        error: err.name,
        message: err.message,
      });
    }

    if (err instanceof MembershipAlreadyExistsError) {
      return res.status(409).json({
        error: err.name,
        message: err.message,
      });
    }

    return res.status(400).json({
      error: err.name,
      message: err.message,
    });
  }

  // Unknown error
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
}

