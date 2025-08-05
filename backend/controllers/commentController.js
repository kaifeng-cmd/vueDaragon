import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Add a comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = new Comment({
      postId,
      userId,
      text,
    });

    await newComment.save();
    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'username');
    
    res.status(201).json(populatedComment);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/posts/:postId/comments/:commentId/
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Ensure the comment belongs to the post
    if (comment.postId.toString() !== postId) {
        return res.status(400).json({ message: 'Comment does not belong to this post' });
    }
    
    const post = await Post.findById(postId);

    // Check if the user is the owner of the comment OR the owner of the post
    if (comment.userId.toString() !== userId && post.userId.toString() !== userId) {
      return res.status(401).json({ message: 'User not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment removed successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Private
export const getPostComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        
        const comments = await Comment.find({ postId })
            .sort({ createdAt: 'desc' })
            .populate('userId', 'username');

        res.json(comments);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
