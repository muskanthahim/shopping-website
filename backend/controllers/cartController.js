import pool from '../config/db.js';

// Helper to get or create active user cart
async function getOrCreateCart(userId = 1) {
  const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
  if (carts.length > 0) return carts[0].id;

  const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
  return result.insertId;
}

export const getCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const cartId = await getOrCreateCart(userId);

    const [items] = await pool.query(
      `SELECT ci.id as cart_item_id, ci.quantity, ci.product_id,
              p.name, p.price, p.sale_price,
              pv.size, pv.color,
              pi.image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_variants pv ON ci.variant_id = pv.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    const formattedCart = items.map(item => ({
      cartItemId: item.cart_item_id,
      id: `mtl-${String(item.product_id).padStart(3, '0')}`,
      name: item.name,
      price: item.sale_price ? Number(item.sale_price) : Number(item.price),
      originalPrice: Number(item.price),
      image: item.image_url || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop',
      size: item.size || 'M',
      color: item.color || 'Standard',
      quantity: item.quantity
    }));

    const subtotal = formattedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      cartId,
      items: formattedCart,
      subtotal,
      itemCount: formattedCart.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ error: 'Failed to retrieve cart.' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const { productId, size = 'M', color = 'Standard', quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }

    const numericProductId = Number(productId.toString().replace('mtl-', ''));
    const cartId = await getOrCreateCart(userId);

    // Verify product stock & price from DB
    const [products] = await pool.query('SELECT id, stock_quantity FROM products WHERE id = ?', [numericProductId]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (products[0].stock_quantity <= 0) {
      return res.status(400).json({ error: 'This product is currently out of stock.' });
    }

    // Find matching variant
    const [variants] = await pool.query(
      'SELECT id FROM product_variants WHERE product_id = ? AND size = ? LIMIT 1',
      [numericProductId, size]
    );
    const variantId = variants.length > 0 ? variants[0].id : null;

    // Check if item already exists in cart
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))',
      [cartId, numericProductId, variantId, variantId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)',
        [cartId, numericProductId, variantId, quantity]
      );
    }

    return getCart(req, res);
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ error: 'Failed to add item to cart. ' + error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    } else {
      await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId]);
    }

    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item.' });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    await pool.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove cart item.' });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;
    const cartId = await getOrCreateCart(userId);
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    res.json({ message: 'Cart cleared', items: [], subtotal: 0, itemCount: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
};
