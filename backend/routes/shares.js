import express from 'express';
import {
  addShare,
  removeShare,
  getPostShares,
} from '../controllers/shareController.js';

const router = express.Router({ mergeParams: true });

// All routes are protected by authVerify in the parent router.

// Route to share a post, unshare a post, and get all shares
// POST   /api/posts/:postId/shares
// DELETE /api/posts/:postId/shares
// GET    /api/posts/:postId/shares
router.route('/')
  .post(addShare)
  .delete(removeShare)
  .get(getPostShares);

export default router;
