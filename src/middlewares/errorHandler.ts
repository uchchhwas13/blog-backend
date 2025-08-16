import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  //console.error(err);

  if (err instanceof ApiError) {
    // Custom API errors
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Fallback for unknown errors
  return res.status(500).json({
    success: false,
    message: (err as Error).message || 'Internal Server Error',
  });
}
