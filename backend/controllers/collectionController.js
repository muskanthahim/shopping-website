import pool from '../config/db.js';

export const getCollections = async (req, res) => {
  try {
    const [collections] = await pool.query('SELECT * FROM collections ORDER BY id ASC');
    res.json(collections);
  } catch (error) {
    console.error('getCollections error:', error);
    res.status(500).json({ error: 'Failed to fetch collections.' });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [collections] = await pool.query('SELECT * FROM collections WHERE id = ?', [id]);
    if (collections.length === 0) {
      return res.status(404).json({ error: 'Collection not found.' });
    }
    res.json(collections[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collection.' });
  }
};
