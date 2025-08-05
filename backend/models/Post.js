import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  mediaUrl: {
    type: String,
    required: false,
  },
  dramaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drama',
    required: false, // Optional, as not every post might be about a drama
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;
