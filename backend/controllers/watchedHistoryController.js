import WatchedHistory from '../models/WatchedHistory.js';
import Friendship from '../models/Friendship.js';
import User from '../models/User.js';
import Drama from '../models/Drama.js';

// Add or update watched history
export const addOrUpdateWatchedHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dramaId, rating } = req.body;
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
    }
    let history = await WatchedHistory.findOne({ userId, dramaId });
    if (history) {
      history.rating = rating;
      await history.save();
      return res.json(history);
    } else {
      history = new WatchedHistory({ userId, dramaId, rating });
      await history.save();
      return res.status(201).json(history);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all watched history for current user
export const getWatchedHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await WatchedHistory.find({ userId })
      .sort({ createdAt: -1 })
      .populate('dramaId', 'Name img url');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update rating for a watched drama
export const updateWatchedHistoryRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dramaId } = req.params;
    const { rating } = req.body;
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
    }
    const history = await WatchedHistory.findOneAndUpdate(
      { userId, dramaId },
      { rating },
      { new: true }
    );
    if (!history) {
      return res.status(404).json({ message: 'Watched history not found.' });
    }
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a watched drama from history
export const deleteWatchedHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dramaId } = req.params;
    const history = await WatchedHistory.findOneAndDelete({ userId, dramaId });
    if (!history) {
      return res.status(404).json({ message: 'Watched history not found.' });
    }
    res.json({ message: 'Watched history deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get friends' watched history activities
export const getFriendsWatchedHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    // Find all friend userIds
    const friendships = await Friendship.find({
      $or: [
        { requesterId: userId },
        { recipientId: userId }
      ],
      status: 'accepted'
    });
    const friendIds = friendships.map(f =>
      f.requesterId.toString() === userId ? f.recipientId : f.requesterId
    );
    // Find all watched history of friends
    const activities = await WatchedHistory.find({ userId: { $in: friendIds } })
      .sort({ updatedAt: -1 })
      .populate('userId', 'username')
      .populate('dramaId', 'Name img url')
      .limit(10);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};