import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';
import { blogTextSchema, blogFileSchema } from '../validations/blogSchema';

export function validateBody<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.error('Validation error:', result.error);
      return res.status(400).json({ error: z.treeifyError(result.error) });
    }
    req.body = result.data;
    next();
  };
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
    blogFileSchema.parse(req.file);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: z.treeifyError(err) });
    }
    return res.status(400).json({ error: err instanceof Error ? err.message : 'Invalid request' });
  }
};
