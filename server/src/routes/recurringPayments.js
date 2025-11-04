import express from 'express';
import {
  getRecurringPayments,
  createRecurringPayment,
  updateRecurringPayment,
  toggleExcludeMonth,
  deleteRecurringPayment
} from '../controllers/recurringPaymentController.js';

const router = express.Router();

router.get('/user/:userId', getRecurringPayments);
router.post('/', createRecurringPayment);
router.put('/:id', updateRecurringPayment);
router.post('/:id/toggle-exclude', toggleExcludeMonth);
router.delete('/:id', deleteRecurringPayment);

export default router;

