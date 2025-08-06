import express from 'express';
import authVerify from '../middleware/authVerify.js';
import {
  addOrUpdateWatchedHistory,
  getWatchedHistory,
  updateWatchedHistoryRating,
  deleteWatchedHistory,
  getFriendsWatchedHistory
} from '../controllers/watchedHistoryController.js';

const router = express.Router();

// All routes require authentication
router.use(authVerify);

// Add or update watched history
router.post('/', addOrUpdateWatchedHistory);
// Get all watched history for current user
router.get('/', getWatchedHistory);
// Update rating for a watched drama
router.put('/:dramaId', updateWatchedHistoryRating);
// Delete a watched drama from history
router.delete('/:dramaId', deleteWatchedHistory);
// Get friends' watched history activities
router.get('/friends/all', getFriendsWatchedHistory);

export default router;