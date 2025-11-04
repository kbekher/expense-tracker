import Category from '../models/Category.js';

// Get all categories for a user
export const getCategories = async (req, res) => {
  try {
    const { userId } = req.params;
    const categories = await Category.find({ userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { userId, name, color } = req.body;
    const category = new Category({ userId, name, color });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, color },
      { new: true }
    );
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

