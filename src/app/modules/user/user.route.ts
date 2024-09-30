import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import {
  userSignUpValidationSchema,
  userLoginValidationSchema,
  userRecoverPasswordValidationSchema,
  userChangePasswordValidationSchema,
} from './user.validation';

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

// Password recovery route (security questions)
router.post(
  '/recover-password',
  validateRequest(userRecoverPasswordValidationSchema),
  UserControllers.recoverPassword,
);

// Password change route (old password verification)
router.post(
  '/change-password',
  validateRequest(userChangePasswordValidationSchema),
  UserControllers.resetPassword,
);

export const UserRoutes = router;
