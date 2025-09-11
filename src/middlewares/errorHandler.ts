import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    console.log(`[API Error] ${err.statusCode} - ${err.message}`);
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors || [],
    });
  }

  console.error('[Unknown Error]', err);
  return res.status(500).json({
    success: false,
    message: (err as Error).message || 'Internal Server Error',
  });
}
