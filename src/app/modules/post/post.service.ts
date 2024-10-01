import mongoose from 'mongoose';
import { Post } from './post.model';
import { TPost } from './post.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';

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
  const filter = query.category ? { category: query.category } : {};

  // Sorting based on upvotes
  const sortCriteria: Record<string, SortOrder> =
    query.sortBy === 'upvotes' ? { upvotes: -1 } : {};

  const posts = await Post.find(filter).sort(sortCriteria);
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

export const PostServices = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  upvotePost,
  downvotePost,
};
