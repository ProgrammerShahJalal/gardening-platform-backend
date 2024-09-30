import { Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';

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

// Password recovery
const recoverPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await UserServices.recoverPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password recovery instructions sent to your email',
    data: {},
  });
});

//password change
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const result = await UserServices.resetPassword(token, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password reset successful',
    data: result,
  });
});

export const UserControllers = {
  signUp,
  login,
  recoverPassword,
  resetPassword,
};
