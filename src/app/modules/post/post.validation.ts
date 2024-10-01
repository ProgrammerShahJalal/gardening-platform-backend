import { z } from 'zod';
import { POST_CATEGORIES } from './post.constant';

export const postValidationSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20), // Minimum content length to ensure quality
  category: z.nativeEnum(POST_CATEGORIES),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  isPremium: z.boolean().optional(),
});
