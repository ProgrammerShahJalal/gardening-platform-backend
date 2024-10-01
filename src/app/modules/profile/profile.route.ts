import { Router } from 'express';
import { ProfileController } from './profile.controller';
import { isAuthenticated } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { followUserSchema, updateProfileSchema } from './profile.validation';

const router = Router();

// Get profile
router.get('/me', isAuthenticated(), ProfileController.getProfile);

// Update profile with validation
router.patch(
  '/me',
  isAuthenticated(),
  validateRequest(updateProfileSchema),
  ProfileController.updateProfile,
);

// Follow/unfollow user with validation
router.post(
  '/follow/:id',
  isAuthenticated(),
  validateRequest(followUserSchema),
  ProfileController.followUser,
);

export const ProfileRoutes = router;
