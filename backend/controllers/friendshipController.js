import Friendship from '../models/Friendship.js';
import User from '../models/User.js';

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user.id;
    const { recipientId } = req.body;
    if (requesterId === recipientId) {
      return res.status(400).json({ message: 'Cannot send friend request to yourself.' });
    }
    // Check if a friendship already exists
    const existing = await Friendship.findOne({
      $or: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId }
      ]
    });
    if (existing) {
      // If declined, check cooldown (7 days)
      if (existing.status === 'declined') {
        const now = new Date();
        const cooldownEnd = new Date(existing.declinedAt);
        cooldownEnd.setDate(cooldownEnd.getDate() + 7);
        if (now < cooldownEnd) {
          return res.status(400).json({ message: 'You must wait 7 days before sending another request.' });
        }
      } else {
        return res.status(400).json({ message: 'Friendship already exists or pending.' });
      }
    }
    // Create new friendship
    const friendship = new Friendship({ requesterId, recipientId, status: 'pending' });
    await friendship.save();
    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { requesterId } = req.body;
    const friendship = await Friendship.findOne({ requesterId, recipientId, status: 'pending' });
    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }
    friendship.status = 'accepted';
    friendship.declinedAt = null;
    await friendship.save();
    res.json(friendship);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Decline a friend request
export const declineFriendRequest = async (req, res) => {
  try {
    const recipientId = req.user.id;
    const { requesterId } = req.body;
    const friendship = await Friendship.findOne({ requesterId, recipientId, status: 'pending' });
    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found.' });
    }
    friendship.status = 'declined';
    friendship.declinedAt = new Date();
    await friendship.save();
    res.json(friendship);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a friend (unfriend)
export const deleteFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    // Find friendship in either direction
    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { requesterId: userId, recipientId: friendId, status: 'accepted' },
        { requesterId: friendId, recipientId: userId, status: 'accepted' }
      ]
    });
    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found.' });
    }
    res.json({ message: 'Friend deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user's friend list
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendships = await Friendship.find({
      $or: [
        { requesterId: userId },
        { recipientId: userId }
      ],
      status: 'accepted'
    });
    // Get friend user IDs
    const friendIds = friendships.map(f =>
      f.requesterId.toString() === userId ? f.recipientId : f.requesterId
    );
    // Populate friend user info
    const friends = await User.find({ _id: { $in: friendIds } }).select('username email');
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get friendship status between current user and another user
export const getFriendshipStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.query;
    const friendship = await Friendship.findOne({
      $or: [
        { requesterId: userId, recipientId: otherUserId },
        { requesterId: otherUserId, recipientId: userId }
      ]
    });
    if (!friendship) {
      return res.json({ status: 'none' });
    }
    // If declined, check cooldown
    if (friendship.status === 'declined') {
      const now = new Date();
      const cooldownEnd = new Date(friendship.declinedAt);
      cooldownEnd.setDate(cooldownEnd.getDate() + 7);
      if (now < cooldownEnd) {
        return res.json({ status: 'cooldown', cooldownEnd });
      }
    }
    res.json({ status: friendship.status });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};