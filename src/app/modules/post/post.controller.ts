import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
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

// Get all posts with optional sorting
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

// Upvote a post
const upvotePost = async (req: Request, res: Response, next: NextFunction) => {
  const { id: postId } = req.params;
  const userId = req.user.id;
  console.log('userId', userId);
  console.log('postId', postId);
  try {
    const post = await PostServices.upvotePost(postId, userId);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Post upvoted successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// Downvote a post
const downvotePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id: postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await PostServices.downvotePost(postId, userId);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Post downvoted successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

//add comment
const addComment = async (req: Request, res: Response, next: NextFunction) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const updatedPost = await PostServices.addComment(postId, userId, content);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment added successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

//edit comment
const editComment = async (req: Request, res: Response, next: NextFunction) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const updatedPost = await PostServices.editComment(
      postId,
      commentId,
      userId,
      content,
    );
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment edited successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// delete comment
const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId, commentId } = req.params;
  const userId = req.user.id;

  try {
    const updatedPost = await PostServices.deleteComment(
      postId,
      commentId,
      userId,
    );
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Comment deleted successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

//add replay to comments
const addReplyToComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const updatedPost = await PostServices.addReplyToComment(
      postId,
      commentId,
      userId,
      content,
    );
    res.status(httpStatus.OK).json({
      status: true,
      statusCode: httpStatus.OK,
      message: 'Reply added successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle post in favourites (add or remove)
const toggleFavouritePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const post = await PostServices.toggleFavouritePost(
      req.user.id,
      req.params.postId,
    );
    const message = post.isFavourite
      ? 'Post added to favourites successfully'
      : 'Post removed from favourites successfully';

    res.status(httpStatus.OK).json({
      status: true,
      statusCode: httpStatus.OK,
      message,
      data: post.postData, // Return the post data
    });
  } catch (error) {
    next(error);
  }
};

const getFavouritePosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Debugging the user ID
    console.log('req.user.id:', req.user.id);

    const favourites = await PostServices.getFavouritePosts(req.user.id);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Favourite posts retrieved successfully',
      data: favourites,
    });
  } catch (error) {
    next(error);
  }
};

export const PostControllers = {
  createPost,
  editPost,
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
