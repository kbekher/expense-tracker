import mongoose from 'mongoose';
import { connectDB, allowCors } from './_db.js';

// RecurringPayment Schema
const recurringPaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  dayOfMonth: { type: Number, required: true, min: 1, max: 31 },
  excludedMonths: [{ type: String, default: [] }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

recurringPaymentSchema.index({ userId: 1 });

const RecurringPayment = mongoose.models.RecurringPayment || mongoose.model('RecurringPayment', recurringPaymentSchema);

// Category Schema (needed for populate)
const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  color: { type: String, default: '#3b82f6' },
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Main handler
const handler = async (req, res) => {
  await connectDB();

  const { method } = req;
  const path = req.url.split('?')[0];

  try {
    // GET /api/recurring-payments/user/:userId
    if (method === 'GET' && path.includes('/user/')) {
      const userId = path.split('/').pop();
      const payments = await RecurringPayment.find({ userId })
        .populate('categoryId', 'name color')
        .sort({ dayOfMonth: 1 });
      return res.json(payments);
    }

    // POST /api/recurring-payments/:id/toggle-exclude
    if (method === 'POST' && path.includes('/toggle-exclude')) {
      const id = path.split('/')[path.split('/').length - 2];
      const { month } = req.body;
      const payment = await RecurringPayment.findById(id);
      
      if (!payment) {
        return res.status(404).json({ error: 'Recurring payment not found' });
      }

      const index = payment.excludedMonths.indexOf(month);
      if (index > -1) {
        payment.excludedMonths.splice(index, 1);
      } else {
        payment.excludedMonths.push(month);
      }

      await payment.save();
      await payment.populate('categoryId', 'name color');
      return res.json(payment);
    }

    // POST /api/recurring-payments
    if (method === 'POST' && !path.includes('/toggle-exclude')) {
      const { userId, name, amount, categoryId, dayOfMonth, excludedMonths } = req.body;
      const payment = new RecurringPayment({
        userId,
        name,
        amount,
        categoryId,
        dayOfMonth,
        excludedMonths: excludedMonths || []
      });
      await payment.save();
      await payment.populate('categoryId', 'name color');
      return res.status(201).json(payment);
    }

    // PUT /api/recurring-payments/:id
    if (method === 'PUT') {
      const id = path.split('/').pop();
      const { name, amount, categoryId, dayOfMonth, excludedMonths, isActive } = req.body;
      const payment = await RecurringPayment.findByIdAndUpdate(
        id,
        { name, amount, categoryId, dayOfMonth, excludedMonths, isActive },
        { new: true }
      ).populate('categoryId', 'name color');
      return res.json(payment);
    }

    // DELETE /api/recurring-payments/:id
    if (method === 'DELETE') {
      const id = path.split('/').pop();
      await RecurringPayment.findByIdAndDelete(id);
      return res.json({ message: 'Recurring payment deleted successfully' });
    }

    return res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('Recurring payments error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export default allowCors(handler);

