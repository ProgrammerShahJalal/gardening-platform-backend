import { Router } from 'express';
import { PostControllers } from './post.controller';
import validateRequest from '../../middlewares/validateRequest';
import { postValidationSchema } from './post.validation';
import { isAuthenticated } from '../../middlewares/auth';

const router = Router();

// Create a post (authorized users only)
router.post(
  '/create',
  isAuthenticated(), // Ensure the user is logged in
  validateRequest(postValidationSchema),
  PostControllers.createPost,
);

// Edit a post
router.patch(
  '/edit/:id',
  isAuthenticated(), // Ensure the user is logged in
  PostControllers.editPost,
);

// Delete a post
router.delete(
  '/delete/:id',
  isAuthenticated(), // Ensure the user is logged in
  PostControllers.deletePost,
);

// Get all posts (no auth required)
router.get('/', PostControllers.getAllPosts);

// Get a single post
router.get('/:id', PostControllers.getPostById);

// Upvote a post
router.post('/upvote/:id', isAuthenticated(), PostControllers.upvotePost);

// Downvote a post
router.post('/downvote/:id', isAuthenticated(), PostControllers.downvotePost);

export const PostRoutes = router;
