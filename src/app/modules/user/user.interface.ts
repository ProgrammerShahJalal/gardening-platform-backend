import { Document, Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: keyof typeof USER_ROLE;
  securityAnswers: string[];
  profilePicture: string;
  followers: string[];
  following: string[];
  isVerified: boolean;
  upvotes: number;
}

// Extend Document to include Mongoose instance methods
export interface TUserDocument extends TUser, Document {}

export interface UserModel extends Model<TUserDocument> {
  isUserExistsByEmail(email: string): Promise<TUserDocument | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
