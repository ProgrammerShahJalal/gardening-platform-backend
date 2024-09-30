import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { TUser } from './user.interface';
import AppError from '../../errors/AppError';
import config from '../../config';
import httpStatus from 'http-status';
import sendEmail from '../../utils/sendEmail';

const createUser = async (userData: TUser) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser)
    throw new AppError(httpStatus.CONFLICT, 'Email already exists');

  const newUser = await User.create(userData);
  return newUser;
};

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

// Password recovery
const recoverPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash the token and set an expiration date (e.g., 1 hour)
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration as Date

  // Save token and expiration date to user's record
  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordExpires = resetPasswordExpires;
  await user.save({ validateBeforeSave: false }); // Save the user without validating other fields

  // Construct the password reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Email content
  const message = `
    You requested to reset your password. Please click the link below to complete the process:
    ${resetUrl}
    If you did not request this, please ignore this email.
  `;

  // Send the recovery email
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Recovery',
      message,
    });
  } catch (error) {
    // If email sending fails, reset token and expiration
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error sending email. Please try again later.',
    );
  }
};

const resetPassword = async (token: string, newPassword: string) => {
  // Hash token and check if it's still valid
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Token is invalid or expired');
  }

  // Set the new password
  user.password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return user;
};

export const UserServices = {
  createUser,
  loginUser,
  resetPassword,
  recoverPassword,
};
