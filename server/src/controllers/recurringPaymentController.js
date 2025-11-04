import RecurringPayment from '../models/RecurringPayment.js';
import Expense from '../models/Expense.js';

// Get all recurring payments for a user
export const getRecurringPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await RecurringPayment.find({ userId })
      .populate('categoryId', 'name color')
      .sort({ dayOfMonth: 1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new recurring payment
export const createRecurringPayment = async (req, res) => {
  try {
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
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a recurring payment
export const updateRecurringPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, categoryId, dayOfMonth, excludedMonths, isActive } = req.body;
    const payment = await RecurringPayment.findByIdAndUpdate(
      id,
      { name, amount, categoryId, dayOfMonth, excludedMonths, isActive },
      { new: true }
    ).populate('categoryId', 'name color');
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Toggle exclude from current month
export const toggleExcludeMonth = async (req, res) => {
  try {
    const { id } = req.params;
    const { month } = req.body; // Format: "YYYY-MM"
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
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a recurring payment
export const deleteRecurringPayment = async (req, res) => {
  try {
    const { id } = req.params;
    await RecurringPayment.findByIdAndDelete(id);
    res.json({ message: 'Recurring payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

