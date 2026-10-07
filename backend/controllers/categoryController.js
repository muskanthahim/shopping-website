import pool from '../config/db.js';

export const getCategories = async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(categories);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [categories] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.json(categories[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const [result] = await pool.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug || name.toLowerCase().replace(/ /g, '-')]);
    res.status(201).json({ message: 'Category created', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    await pool.query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};
