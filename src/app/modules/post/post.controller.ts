import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { PostServices } from './post.service';

// Create a new post
const createPost = catchAsync(async (req: Request, res: Response) => {
  const postData = req.body;
  const authorId = req.user.id;
  const newPost = await PostServices.createPost({
    ...postData,
    author: authorId,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post created successfully',
    data: newPost,
  });
});

// Edit an existing post
const editPost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const updateData = req.body;
  const authorId = req.user.id;
  const updatedPost = await PostServices.updatePost(
    postId,
    updateData,
    authorId,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post updated successfully',
    data: updatedPost,
  });
});

// Delete a post
const deletePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const authorId = req.user.id;

  await PostServices.deletePost(postId, authorId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: undefined,
  });
});

// Get all posts
const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const posts = await PostServices.getAllPosts(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts fetched successfully',
    data: posts,
  });
});

// Get a single post
const getPostById = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;
  const post = await PostServices.getPostById(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post fetched successfully',
    data: post,
  });
});

export const PostControllers = {
  createPost,
  editPost,
  deletePost,
  getAllPosts,
  getPostById,
};
