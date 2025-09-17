import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { formatZodError } from '../utils/formatZodError';

export function validateBody<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const simplifiedErrors = formatZodError(result.error);
      return res.status(400).json({
        error: 'Validation failed',
        details: simplifiedErrors,
      });
    }
    next();
  };
}
