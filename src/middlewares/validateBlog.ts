import { Request, Response, NextFunction } from 'express';
import { z, ZodType } from 'zod';

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

const blogTextSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Content is required'),
});

const blogFileSchema = z.object({
  originalname: z.string().min(1),
  mimetype: z.string().regex(/^image\//, 'File must be an image'),
  size: z.number().max(5 * 1024 * 1024, 'File size must be <= 5MB'),
  filename: z.string().min(1),
  path: z.string().min(1),
});

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
