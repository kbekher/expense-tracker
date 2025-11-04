import express from 'express';
import {
  register,
  login,
  googleAuth,
  getCurrentUser
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', authenticateToken, getCurrentUser);

export default router;

