import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { blogTextSchema, imageFileSchema } from '../validations/blogSchema';
import { formatZodError } from '../utils/formatZodError';

export const validateBlog = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Cover image is required' });
  }
  try {
    blogTextSchema.parse(req.body);
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
