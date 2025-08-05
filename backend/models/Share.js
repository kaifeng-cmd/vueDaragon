import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Optional: You might want to prevent a user from sharing the same post multiple times.
// If so, a compound unique index is a good idea.
shareSchema.index({ postId: 1, userId: 1 }, { unique: true });

const Share = mongoose.model('Share', shareSchema);

export default Share;
