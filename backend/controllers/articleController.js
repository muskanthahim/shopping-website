import pool from '../config/db.js';

export const getArticles = async (req, res) => {
  try {
    const [articles] = await pool.query('SELECT * FROM articles ORDER BY id ASC');
    res.json(articles);
  } catch (error) {
    console.error('getArticles error:', error);
    res.status(500).json({ error: 'Failed to retrieve articles.' });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [articles] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    if (articles.length === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }
    res.json(articles[0]);
  } catch (error) {
    console.error('getArticleById error:', error);
    res.status(500).json({ error: 'Failed to retrieve article.' });
  }
};
