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

// Get a single post
router.get('/:id', PostControllers.getPostById);

// Get all posts (no auth required)
router.get('/', PostControllers.getAllPosts);

// Upvote a post
router.post('/:id/upvote', isAuthenticated(), PostControllers.upvotePost);

// Downvote a post
router.post('/:id/downvote', isAuthenticated(), PostControllers.downvotePost);

// Add a comment to a post
router.post('/:postId/comments', isAuthenticated(), PostControllers.addComment);

// Edit a comment
router.put(
  '/:postId/comments/:commentId',
  isAuthenticated(),
  PostControllers.editComment,
);

// Delete a comment
router.delete(
  '/:postId/comments/:commentId',
  isAuthenticated(),
  PostControllers.deleteComment,
);

// Add a reply to a comment
router.post(
  '/:postId/comments/:commentId/replies',
  isAuthenticated(),
  PostControllers.addReplyToComment,
);

// Toggle a post in favourites (add/remove)
router.post(
  '/favourites/:postId',
  isAuthenticated(),
  PostControllers.toggleFavouritePost,
);

// Get all favourite posts for the logged-in user
router.get(
  '/favourites/:userId',
  isAuthenticated(),
  PostControllers.getFavouritePosts,
);

export const PostRoutes = router;
