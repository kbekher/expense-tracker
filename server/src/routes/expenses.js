import express from 'express';
import {
  getExpenses,
  getExpenseStats,
  createExpense,
  deleteExpense
} from '../controllers/expenseController.js';

const router = express.Router();

router.get('/user/:userId', getExpenses);
router.get('/stats/user/:userId', getExpenseStats);
router.post('/', createExpense);
router.delete('/:id', deleteExpense);

export default router;

