import { Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

// User signup (with security questions)
const signUp = catchAsync(async (req: Request, res: Response) => {
  const userData = req.body;
  const newUser = await UserServices.createUser(userData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User registered successfully',
    data: newUser,
  });
});

// User login
const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await UserServices.loginUser(email, password);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Logged in successfully',
    data: result.user,
    token: result.token,
  });
});

// Password recovery (through security questions)
const recoverPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, answer1, answer2, newPass } = req.body; // Include the answers to security questions
   await UserServices.recoverPassword(email, answer1, answer2, newPass);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password recovered successfully',
    data: {},
  });
});

// Password change (with old password verification)
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;
  await UserServices.changePassword(email, oldPassword, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: {},
  });
});

export const UserControllers = {
  signUp,
  login,
  recoverPassword,
  resetPassword,
};
