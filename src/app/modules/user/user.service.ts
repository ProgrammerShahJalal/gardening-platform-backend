import { User } from './user.model';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import httpStatus from 'http-status';

const UserService = {
  // Register a new user
  async createUser(payload: any) {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds),
    );
    const user = await User.create({ ...payload, password: hashedPassword });
    return user;
  },

  // User login
  async loginUser(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    // Generate JWT
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      config.jwt_access_secret!,
      {
        expiresIn: config.jwt_access_expires_in,
      },
    );

    return { user, token };
  },

  // Get user profile by ID
  async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  },
};

export { UserService };
