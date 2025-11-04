import Expense from '../models/Expense.js';

// Get all expenses for a user (with optional date filtering)
export const getExpenses = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, categoryId } = req.query;

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

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get expense statistics by month/year
export const getExpenseStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { year, month } = req.query;

    const startDate = new Date(year || new Date().getFullYear(), month ? month - 1 : 0, 1);
    const endDate = new Date(year || new Date().getFullYear(), month ? month : 12, 0, 23, 59, 59);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).populate('categoryId', 'name color');

    // Group by category
    const categoryTotals = {};
    let total = 0;

    expenses.forEach(expense => {
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
    });

    res.json({
      total,
      byCategory: Object.values(categoryTotals),
      expenses: expenses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new expense
export const createExpense = async (req, res) => {
  try {
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

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

