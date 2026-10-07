import pool from '../config/db.js';

export const createOrder = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user ? req.user.id : 1;
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      province,
      postalCode,
      paymentMethod = 'Cash on Delivery',
      promoCode,
      items: rawItems
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city || !province) {
      connection.release();
      return res.status(400).json({ error: 'Please provide complete delivery address and contact information.' });
    }

    // Begin Transaction
    await connection.beginTransaction();

    // Fetch items from cart or request body
    let itemsToProcess = [];

    if (rawItems && rawItems.length > 0) {
      itemsToProcess = rawItems;
    } else {
      const [cartRows] = await connection.query(
        `SELECT ci.quantity, ci.product_id, pv.size, pv.color 
         FROM cart_items ci 
         JOIN cart c ON ci.cart_id = c.id 
         LEFT JOIN product_variants pv ON ci.variant_id = pv.id
         WHERE c.user_id = ?`,
        [userId]
      );
      itemsToProcess = cartRows.map(r => ({
        id: `mtl-${String(r.product_id).padStart(3, '0')}`,
        quantity: r.quantity,
        size: r.size || 'M',
        color: r.color || 'Standard'
      }));
    }

    if (itemsToProcess.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({ error: 'Cannot place an order with an empty bag.' });
    }

    // Calculate Prices & Verify Stock directly from MySQL
    let subtotal = 0;
    const validatedOrderItems = [];

    for (const item of itemsToProcess) {
      const numericId = Number(item.id.toString().replace('mtl-', ''));
      
      const [productRows] = await connection.query(
        'SELECT id, name, price, sale_price, stock_quantity FROM products WHERE id = ? FOR UPDATE',
        [numericId]
      );

      if (productRows.length === 0) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ error: `Product "${item.name || item.id}" no longer exists.` });
      }

      const product = productRows[0];

      if (product.stock_quantity < item.quantity) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          error: `Sorry, "${product.name}" only has ${product.stock_quantity} pieces available in stock.`
        });
      }

      const unitPrice = product.sale_price ? Number(product.sale_price) : Number(product.price);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      validatedOrderItems.push({
        productId: product.id,
        productName: product.name,
        price: unitPrice,
        size: item.size || 'M',
        color: item.color || 'Standard',
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    // Shipping & Promo discount calculation
    const shippingFee = subtotal >= 5000 ? 0 : 250;
    let discount = 0;
    if (promoCode && promoCode.trim().toUpperCase() === 'MUSKAN10') {
      discount = Math.round((subtotal * 10) / 100);
    }
    const finalTotal = Math.max(0, subtotal - discount + shippingFee);

    // Generate Order Number
    const orderNumber = `MTL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Insert Order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (user_id, order_number, subtotal, shipping_fee, discount, total, payment_method, payment_status, order_status, customer_name, customer_email, customer_phone, shipping_address, city, province, postal_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', 'Confirmed', ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        orderNumber,
        subtotal,
        shippingFee,
        discount,
        finalTotal,
        paymentMethod,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        province,
        postalCode || ''
      ]
    );

    const orderId = orderResult.insertId;

    // Insert Order Items & Update Stock
    for (const item of validatedOrderItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, size, color, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.productName, item.price, item.size, item.color, item.quantity, item.subtotal]
      );

      // Reduce product stock quantity
      await connection.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // Clear User Cart
    const [cartRows] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
    if (cartRows.length > 0) {
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartRows[0].id]);
    }

    // Commit Transaction
    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Order placed successfully',
      orderNumber,
      orderId,
      total: finalTotal,
      subtotal,
      discount,
      shippingFee,
      items: validatedOrderItems,
      customerName,
      shippingAddress: `${shippingAddress}, ${city}, ${province}`
    });

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('createOrder error:', error);
    res.status(500).json({ error: "We couldn't complete your order. Please try again. " + error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;

    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order history.' });
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const [orders] = await pool.query('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orders[0];
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);

    res.json({ order, items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details.' });
  }
};
