import { Request, Response, NextFunction } from 'express';
import { z, ZodType, ZodError } from 'zod';
import { blogTextSchema, imageFileSchema } from '../validations/blogSchema';

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

export function formatZodError(error: ZodError) {
  return error._zod.def.map((err) => {
    return {
      field: err.path.join('.'),
      message: err.message,
    };
  });
}

export const validateBlog = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    blogTextSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({ error: 'Cover image is required' });
    }
    imageFileSchema.parse(req.file);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const simplifiedErrors = formatZodError(err);
      return res.status(400).json({
        error: 'Validation failed',
        details: simplifiedErrors,
      });
    }
    return res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid request' });
  }
};
