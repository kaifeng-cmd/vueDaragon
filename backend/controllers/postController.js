import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import Share from '../models/Share.js';
import Drama from '../models/Drama.js'; // Import Drama model

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { content, mediaUrl, dramaId } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    // Optional: Check if the drama exists before creating the post
    if (dramaId) {
        const dramaExists = await Drama.findById(dramaId);
        if (!dramaExists) {
            return res.status(404).json({ message: 'Drama not found' });
        }
    }

    const post = new Post({
      userId,
      content,
      mediaUrl,
      dramaId, // Add dramaId to the new post
    });

    const createdPost = await post.save();
    
    // Populate user and drama info for the response
    const populatedPost = await Post.findById(createdPost._id)
        .populate('userId', 'username')
        .populate('dramaId', 'Name "img url"');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'username') // Populate user's name
      .populate('dramaId', 'Name "img url"'); // Populate drama's name and image

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:postId
// @access  Private
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
        .populate('userId', 'username')
        .populate('dramaId', 'Name "img url"');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:postId
// @access  Private (only the post owner can delete)
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user trying to delete the post is the owner
    if (post.userId.toString() !== userId) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Delete the post and all associated data
    await post.deleteOne();
    await Like.deleteMany({ postId: postId });
    await Comment.deleteMany({ postId: postId });
    await Share.deleteMany({ postId: postId });

    res.json({ message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
