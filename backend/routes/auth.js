import express from 'express';
const router = express.Router();
import * as authController from '../controllers/authController.js';

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;