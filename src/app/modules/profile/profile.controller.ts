import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import httpStatus from 'http-status';
import { ProfileServices } from './profile.service';

// Get Profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const userProfile = await ProfileServices.getProfile(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile fetched successfully',
    data: userProfile,
  });
});

// Update Profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const updateData = req.body; 

  const updatedUser = await ProfileServices.updateProfile(userId, updateData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});

// Follow/Unfollow User
const followUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const targetUserId = req.params.id; // User ID to follow/unfollow
  const result = await ProfileServices.followUser(userId, targetUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: {},
  });
});

export const ProfileController = {
  getProfile,
  updateProfile,
  followUser,
};
