import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: keyof typeof USER_ROLE;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
