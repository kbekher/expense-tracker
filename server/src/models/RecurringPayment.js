import mongoose from 'mongoose';

const recurringPaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  dayOfMonth: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  excludedMonths: [{
    type: String, // Format: "YYYY-MM"
    default: []
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

recurringPaymentSchema.index({ userId: 1 });

export default mongoose.model('RecurringPayment', recurringPaymentSchema);

