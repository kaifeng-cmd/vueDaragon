import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
} from '../controllers/postController.js';
import authVerify from '../middleware/authVerify.js';

// Import sub-routes
import likeRoutes from './likes.js';
import commentRoutes from './comments.js';
import shareRoutes from './shares.js';

const router = express.Router();

// Apply authVerify middleware to all routes in this file
router.use(authVerify);

// --- Post-specific routes ---
router.route('/')
  .post(createPost)
  .get(getAllPosts);

router.route('/:postId/')
  .get(getPostById)
  .delete(deletePost);

// --- Nested Routes ---
// Forward requests to the appropriate sub-routers
router.use('/:postId/likes', likeRoutes);
router.use('/:postId/comments', commentRoutes);
router.use('/:postId/shares', shareRoutes);

export default router;
