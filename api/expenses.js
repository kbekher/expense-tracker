import mongoose from 'mongoose';
import { connectDB, allowCors } from './_db.js';

// Expense Schema
const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, categoryId: 1 });

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

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
  const url = new URL(req.url, `http://${req.headers.host}`);
  const params = Object.fromEntries(url.searchParams);

  try {
    // GET /api/expenses/user/:userId
    if (method === 'GET' && path.match(/\/user\/[^/]+$/) && !path.includes('/stats')) {
      const userId = path.split('/').pop();
      const { startDate, endDate, categoryId } = params;

      const query = { userId };
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
      if (categoryId) {
        query.categoryId = categoryId;
      }

      const expenses = await Expense.find(query)
        .populate('categoryId', 'name color')
        .sort({ date: -1 });

      return res.json(expenses);
    }

    // GET /api/expenses/stats/user/:userId
    if (method === 'GET' && path.includes('/stats/user/')) {
      const userId = path.split('/').pop();
      const { year, month } = params;

      const currentYear = year ? parseInt(year) : new Date().getFullYear();
      const currentMonth = month ? parseInt(month) : null;

      const startDate = new Date(currentYear, currentMonth ? currentMonth - 1 : 0, 1);
      const endDate = new Date(currentYear, currentMonth ? currentMonth : 12, 0, 23, 59, 59);

      const expenses = await Expense.find({
        userId,
        date: { $gte: startDate, $lte: endDate }
      }).populate('categoryId', 'name color');

      // Group by category
      const categoryTotals = {};
      let total = 0;

      expenses.forEach(expense => {
        if (expense.categoryId) {
          const categoryName = expense.categoryId.name;
          if (!categoryTotals[categoryName]) {
            categoryTotals[categoryName] = {
              name: categoryName,
              color: expense.categoryId.color,
              total: 0
            };
          }
          categoryTotals[categoryName].total += expense.amount;
          total += expense.amount;
        }
      });

      return res.json({
        total,
        byCategory: Object.values(categoryTotals),
        expenses: expenses
      });
    }

    // POST /api/expenses
    if (method === 'POST') {
      const { userId, amount, categoryId, date, description } = req.body;

      const expense = new Expense({
        userId,
        amount,
        categoryId,
        date: date ? new Date(date) : new Date(),
        description
      });

      await expense.save();
      await expense.populate('categoryId', 'name color');

      return res.status(201).json(expense);
    }

    // DELETE /api/expenses/:id
    if (method === 'DELETE' && path.split('/').length === 3) {
      const id = path.split('/').pop();
      await Expense.findByIdAndDelete(id);
      return res.json({ message: 'Expense deleted successfully' });
    }

    return res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('Expenses error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export default allowCors(handler);

