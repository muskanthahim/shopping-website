import pool from '../config/db.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1; // Default fallback user for demo session

    const [items] = await pool.query(
      `SELECT w.id as wishlist_id, w.created_at, p.* 
       FROM wishlist w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = ?`,
      [userId]
    );

    const productIds = items.map(i => `mtl-${String(i.id).padStart(3, '0')}`);
    res.json({ wishlist: productIds, items });
  } catch (error) {
    console.error('getWishlist error:', error);
    res.status(500).json({ error: 'Failed to retrieve wishlist.' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    let { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }

    const numericId = Number(productId.toString().replace('mtl-', ''));

    // Check if product exists
    const [products] = await pool.query('SELECT id FROM products WHERE id = ?', [numericId]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await pool.query(
      'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [userId, numericId]
    );

    res.json({ message: 'Added to wishlist', productId });
  } catch (error) {
    console.error('addToWishlist error:', error);
    res.status(500).json({ error: 'Failed to add to wishlist.' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const { productId } = req.params;
    const numericId = Number(productId.toString().replace('mtl-', ''));

    await pool.query(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, numericId]
    );

    res.json({ message: 'Removed from wishlist', productId });
  } catch (error) {
    console.error('removeFromWishlist error:', error);
    res.status(500).json({ error: 'Failed to remove from wishlist.' });
  }
};
