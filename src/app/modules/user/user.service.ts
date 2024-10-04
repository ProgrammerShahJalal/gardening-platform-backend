import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { TUser } from './user.interface';
import AppError from '../../errors/AppError';
import config from '../../config';
import httpStatus from 'http-status';

// User creation with security questions
const createUser = async (userData: TUser) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser)
    throw new AppError(httpStatus.CONFLICT, 'Email already exists');

  // Ensure security questions are provided
  if (!userData.securityAnswers || userData.securityAnswers.length < 2) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please provide two security answers',
    );
  }

  // Save the user
  const newUser = await User.create(userData);
  return newUser;
};

//login user
const loginUser = async (email: string, password: string) => {
  const user = await User.isUserExistsByEmail(email);
  if (!user || !(await User.isPasswordMatched(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    config.jwt_access_secret as string,
    {
      expiresIn: config.jwt_access_expires_in,
    },
  );

  return { user, token };
};

// Password recovery with security questions
const recoverPassword = async (
  email: string,
  answer1: string,
  answer2: string,
  newPass: string,
) => {
  const user = await User.findOne({ email }).select('+securityAnswers');
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  // Check if security answers match
  const isAnswer1Matched = await bcrypt.compare(
    answer1,
    user.securityAnswers[0],
  );
  const isAnswer2Matched = await bcrypt.compare(
    answer2,
    user.securityAnswers[1],
  );

  if (!isAnswer1Matched || !isAnswer2Matched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Security answers are incorrect',
    );
  }

  // Update password
  user.password = newPass; // Assign the new password (pre-save hook will hash it)

  // Save the updated user (pre('save') will handle hashing)
  await user.save();

  return user; // Return the updated user with the new password

};

// Password change (with old password verification)
const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  // Explicitly select the password field
  const user = await User.findOne({ email }).select('+password');

  // Check if the user exists and if the old password matches
  if (!user || !(await User.isPasswordMatched(oldPassword, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Old password is incorrect');
  }

  // Update password
  user.password = newPassword; // Assign the new password (pre-save hook will hash it)

  // Save the updated user (pre('save') will handle hashing)
  await user.save();

  return user;
};

export const UserServices = {
  createUser,
  loginUser,
  recoverPassword,
  changePassword,
};
