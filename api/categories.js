import mongoose from 'mongoose';
import { connectDB, allowCors } from './_db.js';

// Category Schema
const categorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  color: { type: String, default: '#3b82f6' },
  createdAt: { type: Date, default: Date.now }
});

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

// Main handler
const handler = async (req, res) => {
  await connectDB();

  const { method } = req;
  const path = req.url.split('?')[0];

  try {
    // GET /api/categories/user/:userId
    if (method === 'GET' && path.includes('/user/')) {
      const userId = path.split('/').pop();
      const categories = await Category.find({ userId }).sort({ name: 1 });
      return res.json(categories);
    }

    // POST /api/categories
    if (method === 'POST') {
      const { userId, name, color } = req.body;
      const category = new Category({ userId, name, color });
      await category.save();
      return res.status(201).json(category);
    }

    // PUT /api/categories/:id
    if (method === 'PUT') {
      const id = path.split('/').pop();
      const { name, color } = req.body;
      const category = await Category.findByIdAndUpdate(
        id,
        { name, color },
        { new: true }
      );
      return res.json(category);
    }

    // DELETE /api/categories/:id
    if (method === 'DELETE') {
      const id = path.split('/').pop();
      await Category.findByIdAndDelete(id);
      return res.json({ message: 'Category deleted successfully' });
    }

    return res.status(404).json({ error: 'Route not found' });

  } catch (error) {
    console.error('Categories error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export default allowCors(handler);

