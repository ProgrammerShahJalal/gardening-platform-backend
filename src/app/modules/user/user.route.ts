import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { createUserSchema, loginUserSchema } from './user.validation';

const router = Router();

// User registration route
router.post(
  '/register',
  validateRequest(createUserSchema),
  UserController.createUser,
);

// User login route
router.post(
  '/login',
  validateRequest(loginUserSchema),
  UserController.loginUser,
);

// Get user profile (Protected route)
router.get('/profile', auth('user', 'admin'), UserController.getUserProfile);

export const UserRoutes = router;
