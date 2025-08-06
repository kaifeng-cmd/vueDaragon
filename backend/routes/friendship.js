import express from 'express';
import authVerify from '../middleware/authVerify.js';
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  deleteFriend,
  getFriends,
  getFriendshipStatus
} from '../controllers/friendshipController.js';

const router = express.Router();

// All routes require authentication
router.use(authVerify);

// Send a friend request
router.post('/request', sendFriendRequest);

// Accept a friend request
router.post('/accept', acceptFriendRequest);

// Decline a friend request
router.post('/decline', declineFriendRequest);

// Delete a friend
router.delete('/', deleteFriend);

// Get current user's friend list
router.get('/', getFriends);

// Get friendship status between current user and another user
router.get('/status', getFriendshipStatus);

export default router;