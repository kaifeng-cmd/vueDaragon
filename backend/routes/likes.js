import express from 'express';
import {
  addLike,
  removeLike,
  getPostLikes,
} from '../controllers/likeController.js';

// By setting mergeParams to true, this router will be able to access
// the parameters of its parent router (e.g., :postId from the posts router).
const router = express.Router({ mergeParams: true });

// Note: authVerify is already applied in the parent posts.js router,
// so all these routes are already protected.

// Route to like a post and get all likes
// POST /api/posts/:postId/likes
// GET  /api/posts/:postId/likes
router.route('/')
  .post(addLike)
  .get(getPostLikes);

// Route to unlike a post
// DELETE /api/posts/:postId/likes
// The userId is retrieved from the JWT token (req.user.id), so it's not needed in the URL.
router.route('/')
  .delete(removeLike);

export default router;
