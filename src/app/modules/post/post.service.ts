import mongoose from 'mongoose';
import { Post } from './post.model';
import { TComment, TPost } from './post.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import { User } from '../user/user.model';

// Create a new post
const createPost = async (postData: TPost) => {
  const newPost = await Post.create(postData);
  return newPost;
};

// Update a post
const updatePost = async (
  postId: string,
  updateData: Partial<TPost>,
  authorId: string,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.author.toString() !== authorId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to edit this post',
    );
  }

  Object.assign(post, updateData);
  await post.save();
  return post;
};

// Delete a post
const deletePost = async (postId: string, authorId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.author.toString() !== authorId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this post',
    );
  }
  await post.deleteOne();
};

// Get all posts with optional filtering and sorting
const getAllPosts = async (query: any) => {
  const filter: any = {};

  // Apply category filter if provided
  if (query.category) {
    filter.category = query.category;
  }

  // Apply author filter (for "my posts") if provided
  if (query.author) {
    filter.author = query.author;
  }

  // Sorting based on upvotes
  const sortCriteria: Record<string, SortOrder> =
    query.sortBy === 'upvotes' ? { upvotes: -1 } : {};

  // Fetch the posts from the database with filters and sorting
  const posts = await Post.find(filter)
    .sort(sortCriteria)
    .populate('author', 'name email profilePicture');

  return posts;
};

// Get a single post by ID
const getPostById = async (postId: string) => {
  const post = await Post.findById(postId).populate('author');
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return post;
};

// Upvote a post
const upvotePost = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Remove the user from downvotes if they have downvoted before
  post.downvotes = post.downvotes.filter(
    (downvoteUserId) => !downvoteUserId.equals(userObjectId),
  );

  // Add the user to upvotes if they haven't already upvoted
  if (!post.upvotes.some((upvoteUserId) => upvoteUserId.equals(userObjectId))) {
    post.upvotes.push(userObjectId);
  }

  await post.save();
  return post;
};

// Downvote a post
const downvotePost = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Remove the user from upvotes if they have upvoted before
  post.upvotes = post.upvotes.filter(
    (upvoteUserId) => !upvoteUserId.equals(userObjectId),
  );

  // Add the user to downvotes if they haven't already downvoted
  if (
    !post.downvotes.some((downvoteUserId) =>
      downvoteUserId.equals(userObjectId),
    )
  ) {
    post.downvotes.push(userObjectId);
  }

  await post.save();
  return post;
};

//add comment
const addComment = async (
  postId: string,
  userId: string,
  commentContent: string,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const newComment: TComment = {
    content: commentContent,
    author: new mongoose.Types.ObjectId(userId),
    replies: [],
    createdAt: new Date(),
  };

  post.comments.push(newComment);

  await post.save();

  // Populate the author field (name and profilePicture) in the comments
  const populatedPost = await Post.findById(postId).populate({
    path: 'comments.author',
    select: 'name profilePicture',
  });

  return populatedPost;
};

//edit comment
const editComment = async (
  postId: string,
  commentId: string,
  userId: string,
  updatedContent: string,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Use filter or find to get the comment by its id
  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId,
  );

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // Check if the user is authorized to edit the comment
  if (comment.author.toString() !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to edit this comment',
    );
  }

  // Update the comment content
  comment.content = updatedContent;

  await post.save();

  // Populate the author field in the updated comments
  const populatedPost = await Post.findById(postId).populate({
    path: 'comments.author',
    select: 'name profilePicture',
  });

  return populatedPost;
};

//delete comment
const deleteComment = async (
  postId: string,
  commentId: string,
  userId: string,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Find the comment by its ID
  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId,
  );

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  // Check if the user is authorized to delete the comment
  if (comment.author.toString() !== userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'You are not authorized to delete this comment',
    );
  }

  // Remove the comment by filtering it out from the comments array
  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== commentId,
  );

  // Save the updated post
  await post.save();

  // Populate the author field in the remaining comments
  const populatedPost = await Post.findById(postId).populate({
    path: 'comments.author',
    select: 'name profilePicture',
  });

  return populatedPost;
};

//add reply to comment
const addReplyToComment = async (
  postId: string,
  commentId: string,
  userId: string,
  replyContent: string,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  // Find the comment by its ID
  const comment = post.comments.find(
    (comment) => comment._id.toString() === commentId,
  );

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  const newReply = {
    content: replyContent,
    author: new mongoose.Types.ObjectId(userId),
    createdAt: new Date(),
  };

  comment.replies.push(newReply);
  await post.save();

  // Populate the author field (name and profilePicture) in replies
  const populatedPost = await Post.findById(postId).populate({
    path: 'comments.replies.author',
    select: 'name profilePicture',
  });

  return populatedPost;
};

// Toggle post in favourites (add or remove)
const toggleFavouritePost = async (userId: string, postId: string) => {
  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found');
  }

  const isFavourite = user.favourites.includes(postId);

  if (isFavourite) {
    // Remove from favourites
    user.favourites = user.favourites.filter(
      (favPostId) => favPostId.toString() !== postId,
    );
  } else {
    // Add to favourites
    user.favourites.push(postId);
  }

  await user.save();

  return {
    isFavourite: !isFavourite, // Return the updated state (whether it's now a favourite or not)
    postData: post, // Return the post data
  };
};

// get favourites posts
const getFavouritePosts = async (userId: string) => {
  // Ensure userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
  }

  const user = await User.findById(userId).populate({
    path: 'favourites',
    model: 'Post', // Ensure it references the correct Post model
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if each favourite is a valid ObjectId
  if (
    !user.favourites.every((favourite: any) =>
      mongoose.Types.ObjectId.isValid(favourite._id),
    )
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Post ID in favourites');
  }

  return user.favourites;
};

export const PostServices = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  upvotePost,
  downvotePost,
  addComment,
  editComment,
  deleteComment,
  addReplyToComment,
  toggleFavouritePost,
  getFavouritePosts,
};
