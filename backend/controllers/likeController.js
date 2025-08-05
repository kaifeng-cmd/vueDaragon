import Like from '../models/Like.js';
import Post from '../models/Post.js';

// @desc    Like a post
// @route   POST /api/posts/:postId/likes
// @access  Private
export const addLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    // Create new like
    const newLike = new Like({
      postId,
      userId,
    });

    await newLike.save();
    res.status(201).json(newLike);

  } catch (error) {
    // Handle potential duplicate key error gracefully, though the check above should prevent it.
    if (error.code === 11000) {
        return res.status(400).json({ message: 'You have already liked this post' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:postId/likes
// @access  Private
export const removeLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const like = await Like.findOneAndDelete({ postId, userId });

    if (!like) {
      return res.status(404).json({ message: 'Like not found. You might have not liked this post.' });
    }

    res.json({ message: 'Post unliked successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all likes for a post
// @route   GET /api/posts/:postId/likes
// @access  Private
export const getPostLikes = async (req, res) => {
    try {
        const postId = req.params.postId;
        
        const likes = await Like.find({ postId }).populate('userId', 'username');

        res.json(likes);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
