import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { UserService } from './user.service';

const UserController = {
  // User registration
  createUser: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await UserService.createUser(req.body);
      sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: user,
      });
    },
  ),

  // User login
  loginUser: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const { token, user } = await UserService.loginUser(email, password);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Login successful',
        token,
        data: user,
      });
    },
  ),

  // Get user profile
  getUserProfile: catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getUserProfile(req.user._id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  }),
};

export { UserController };
