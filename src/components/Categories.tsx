import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import type { Category } from '../types';

interface CategoriesProps {
  userId: string;
}

const COLOR_PRESETS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export default function Categories({ userId }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(COLOR_PRESETS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  useEffect(() => {
    loadCategories();
  }, [userId]);

  const loadCategories = async () => {
    try {
      const cats = await getCategories(userId);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await createCategory(userId, newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setShowAddForm(false);
      loadCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Failed to create category. It might already exist.');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      await updateCategory(id, editName.trim(), editColor);
      setEditingId(null);
      loadCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Failed to update category.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category.');
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  return (
    <div className="categories">
      <div className="section-header">
        <h2>Categories</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className="add-btn">
          {showAddForm ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name"
            required
            autoFocus
          />
          <div className="color-picker">
            <label>Color:</label>
            <div className="color-options">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${newCategoryColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setNewCategoryColor(color)}
                />
              ))}
            </div>
          </div>
          <button type="submit" className="submit-btn">Create</button>
        </form>
      )}

      <div className="categories-list">
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories yet. Create your first category!</p>
          </div>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="category-item">
              {editingId === category._id ? (
                <div className="category-edit">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <div className="color-options">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${editColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setEditColor(color)}
                      />
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button onClick={() => handleUpdate(category._id)} className="save-btn">✓</button>
                    <button onClick={() => setEditingId(null)} className="cancel-btn">✕</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="category-info">
                    <span className="category-color" style={{ backgroundColor: category.color }}></span>
                    <span className="category-name">{category.name}</span>
                  </div>
                  <div className="category-actions">
                    <button onClick={() => startEdit(category)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDelete(category._id)} className="delete-btn">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

