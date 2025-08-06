import mongoose from 'mongoose';

const watchedHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dramaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drama',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
}, {
  timestamps: true, // createdAt = time added to history
});

// Unique index to prevent duplicate history for the same user and drama
watchedHistorySchema.index({ userId: 1, dramaId: 1 }, { unique: true });

export default mongoose.model('WatchedHistory', watchedHistorySchema);