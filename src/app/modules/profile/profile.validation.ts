import { z } from 'zod';

// Validation schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  profilePicture: z.string().url().optional(),
  phone: z.string().min(10).max(15).optional(),
  address: z.string().min(5).max(100).optional(),
});

// Validation middleware for updating profile
export const validateUpdateProfile = (req: any, res: any, next: any) => {
  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: result.error.errors.map((err) => err.message),
    });
  }

  next();
};

// Validation schema for following/unfollowing a user
export const followUserSchema = z.object({
  id: z.string().nonempty(),
});

// Validation middleware for follow/unfollow user
export const validateFollowUser = (req: any, res: any, next: any) => {
  const result = followUserSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: result.error.errors.map((err) => err.message),
    });
  }

  next();
};
