import { Post } from './post.model';
import { TPost } from './post.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

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

// Get all posts with optional filtering
const getAllPosts = async (query: any) => {
  const filter = query.category ? { category: query.category } : {};
  const posts = await Post.find(filter);
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

export const PostServices = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
};
