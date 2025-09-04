import { z } from 'zod';

export const blogLikeSchema = z.object({
  isLiked: z.boolean(),
});
