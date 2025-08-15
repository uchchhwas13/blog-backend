import { z } from 'zod';
export const blogTextSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Content is required'),
});

export const blogFileSchema = z.object({
  originalname: z.string().min(1),
  mimetype: z.string().regex(/^image\//, 'File must be an image'),
  size: z.number().max(5 * 1024 * 1024, 'File size must be <= 5MB'),
  filename: z.string().min(1),
  path: z.string().min(1),
});
