import Share from '../models/Share.js';
import Post from '../models/Post.js';

// @desc    Share a post
// @route   POST /api/posts/:postId/shares
// @access  Private
export const addShare = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Using findOne to check for existence is more explicit than relying on duplicate key error
    const existingShare = await Share.findOne({ postId, userId });
    if (existingShare) {
      return res.status(400).json({ message: 'You have already shared this post' });
    }

    const newShare = new Share({
      postId,
      userId,
    });

    await newShare.save();
    res.status(201).json(newShare);

  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'You have already shared this post' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unshare a post
// @route   DELETE /api/posts/:postId/shares
// @access  Private
export const removeShare = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const share = await Share.findOneAndDelete({ postId, userId });

    if (!share) {
      return res.status(404).json({ message: 'Share not found. You might have not shared this post.' });
    }

    res.json({ message: 'Post unshared successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all shares for a post
// @route   GET /api/posts/:postId/shares
// @access  Private
export const getPostShares = async (req, res) => {
    try {
        const postId = req.params.postId;
        
        const shares = await Share.find({ postId }).populate('userId', 'username');

        res.json(shares);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
