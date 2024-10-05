import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TProfile } from './profile.interface';

// Get user profile by ID
const getProfile = async (userId: string): Promise<TProfile | null> => {
  const user = await User.findById(userId)
    .select(
      'name email address phone role profilePicture followers following isVerified upvotes',
    )
    .populate('followers', 'name profilePicture')
    .populate('following', 'name profilePicture');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Update user profile
const updateProfile = async (
  userId: string,
  updateData: Partial<TProfile>,
): Promise<TProfile | null> => {
  const allowedFields: (keyof TProfile)[] = ['name', 'phone', 'address', 'profilePicture']; // Define allowed fields

  const filteredUpdateData = Object.keys(updateData)
    .filter((key): key is keyof TProfile => allowedFields.includes(key as keyof TProfile)) // Type guard to ensure key is a valid TProfile key
    .reduce((obj, key) => {
      return { ...obj, [key]: updateData[key] }; // Spread to accumulate filtered keys and values
    }, {} as Partial<TProfile>); // Explicitly cast as Partial<TProfile>

  const user = await User.findByIdAndUpdate(userId, filteredUpdateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};



// Follow or Unfollow a user
const followUser = async (
  userId: string,
  targetUserId: string,
): Promise<{ message: string }> => {
  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isFollowing = user.following.includes(targetUserId);

  if (isFollowing) {
    // Unfollow
    user.following = user.following.filter((id) => id !== targetUserId); // Remove targetUserId from following
    targetUser.followers = targetUser.followers.filter((id) => id !== userId); // Remove userId from targetUser's followers
  } else {
    // Follow
    user.following.push(targetUserId); // Add targetUserId to following
    targetUser.followers.push(userId); // Add userId to targetUser's followers
  }

  await user.save();
  await targetUser.save();

  return {
    message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
  };
};

export const ProfileServices = {
  getProfile,
  updateProfile,
  followUser,
};
