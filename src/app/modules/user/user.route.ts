import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import {
  userSignUpValidationSchema,
  userLoginValidationSchema,
  userRecoverPasswordValidationSchema,
  userResetPasswordValidationSchema,
} from './user.validation';
import { UserControllers } from './user.controller';

const router = Router();

// User registration route
router.post(
  '/register',
  validateRequest(userSignUpValidationSchema),
  UserControllers.signUp,
);

// User login route
router.post(
  '/login',
  validateRequest(userLoginValidationSchema),
  UserControllers.login,
);

// Password recovery route
router.post(
  '/recover-password',
  validateRequest(userRecoverPasswordValidationSchema),
  UserControllers.recoverPassword,
);

// Password reset route
router.post(
  '/reset-password',
  validateRequest(userResetPasswordValidationSchema),
  UserControllers.resetPassword,
);

export const UserRoutes = router;
