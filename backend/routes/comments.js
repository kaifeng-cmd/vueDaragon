import express from 'express';
import {
  addComment,
  deleteComment,
  getPostComments,
} from '../controllers/commentController.js';

const router = express.Router({ mergeParams: true });

// All routes are protected by authVerify in the parent router.

// Route to add a comment and get all comments for a post
// POST /api/posts/:postId/comments
// GET  /api/posts/:postId/comments
router.route('/')
  .post(addComment)
  .get(getPostComments);

// Route to delete a specific comment
// DELETE /api/posts/:postId/comments/:commentId
router.route('/:commentId/')
  .delete(deleteComment);

export default router;
