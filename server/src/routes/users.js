import express from 'express';
import {
  getOrCreateUser,
  getUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', getOrCreateUser);
router.get('/:id', getUser);

export default router;

