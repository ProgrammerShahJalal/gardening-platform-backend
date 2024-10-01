import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import { USER_ROLE } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.user,
    },
    profilePicture: {
      type: String,
      default: 'https://i.ibb.co/Wx1JfLK/user-icon.png',
    }, // Profile picture URL
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // List of followers
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }], // List of users being followed
    isVerified: { type: Boolean, default: false }, // Verification status
    upvotes: { type: Number, default: 0 }, // Track upvotes
    securityAnswers: { type: [String], required: true, select: false },
  },
  { timestamps: true },
);

// Pre-save hooks for hashing password and security answers
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  if (this.isModified('securityAnswers')) {
    this.securityAnswers = await Promise.all(
      this.securityAnswers.map((answer) => bcrypt.hash(answer, 10)),
    );
  }
  next();
});

// Static method to check if a user exists by email
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email }).select('+password');
};

// Static method to compare passwords
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
