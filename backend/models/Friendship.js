import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cooldown'],
    default: 'pending',
    required: true,
  },
  declinedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Prevent duplicate friendship relationships
friendshipSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export default mongoose.model('Friendship', friendshipSchema);