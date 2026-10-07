import pool from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      collection,
      minPrice,
      maxPrice,
      size,
      color,
      sort,
      page = 1,
      limit = 50
    } = req.query;

    let query = `
      SELECT p.*, 
             c.name as category_name, c.slug as category_slug,
             col.name as collection_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN collections col ON p.collection_id = col.id
      WHERE 1=1
    `;
    const params = [];

    // Search filter
    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.fabric LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    // Category filter (slug, name or ID)
    if (category && category !== 'All') {
      if (!isNaN(category)) {
        query += ` AND p.category_id = ?`;
        params.push(Number(category));
      } else {
        query += ` AND (c.name = ? OR c.slug = ?)`;
        params.push(category, category.toLowerCase());
      }
    }

    // Collection filter
    if (collection && collection !== 'All Collections') {
      if (!isNaN(collection)) {
        query += ` AND p.collection_id = ?`;
        params.push(Number(collection));
      } else {
        query += ` AND col.name = ?`;
        params.push(collection);
      }
    }

    // Price range
    if (minPrice) {
      query += ` AND COALESCE(p.sale_price, p.price) >= ?`;
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ` AND COALESCE(p.sale_price, p.price) <= ?`;
      params.push(Number(maxPrice));
    }

    // Sorting
    if (sort === 'price_asc' || sort === 'price-low') {
      query += ` ORDER BY COALESCE(p.sale_price, p.price) ASC`;
    } else if (sort === 'price_desc' || sort === 'price-high') {
      query += ` ORDER BY COALESCE(p.sale_price, p.price) DESC`;
    } else if (sort === 'newest') {
      query += ` ORDER BY p.is_new DESC, p.created_at DESC`;
    } else if (sort === 'best_selling' || sort === 'best-selling') {
      query += ` ORDER BY p.is_best_seller DESC, p.rating DESC`;
    } else {
      query += ` ORDER BY p.id ASC`;
    }

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [products] = await pool.query(query, params);

    // Fetch images and variants for each product
    const productIds = products.map(p => p.id);

    let imagesByProduct = {};
    let variantsByProduct = {};

    if (productIds.length > 0) {
      const [images] = await pool.query(
        'SELECT * FROM product_images WHERE product_id IN (?) ORDER BY is_primary DESC, id ASC',
        [productIds]
      );
      images.forEach(img => {
        if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
        imagesByProduct[img.product_id].push(img.image_url);
      });

      const [variants] = await pool.query(
        'SELECT * FROM product_variants WHERE product_id IN (?)',
        [productIds]
      );
      variants.forEach(v => {
        if (!variantsByProduct[v.product_id]) variantsByProduct[v.product_id] = [];
        variantsByProduct[v.product_id].push(v);
      });
    }

    // Format products for frontend compatibility
    const formattedProducts = products.map(p => {
      const pImages = imagesByProduct[p.id] || [];
      const pVariants = variantsByProduct[p.id] || [];
      const pSizes = Array.from(new Set(pVariants.map(v => v.size)));
      const pColors = Array.from(new Set(pVariants.map(v => v.color))).map(colorName => ({
        name: colorName,
        hex: getColorHex(colorName)
      }));

      return {
        id: `mtl-${String(p.id).padStart(3, '0')}`,
        rawId: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        salePrice: p.sale_price ? Number(p.sale_price) : null,
        category: p.category_name || 'Lawn',
        collection: p.collection_name || "Autumn Edit '26",
        description: p.description,
        fabric: p.fabric,
        sizes: pSizes.length > 0 ? pSizes : ['XS', 'S', 'M', 'L', 'XL'],
        colors: pColors.length > 0 ? pColors : [{ name: 'Standard', hex: '#1C1B1B' }],
        images: pImages.length > 0 ? pImages : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000&auto=format&fit=crop'],
        rating: Number(p.rating || 5.0),
        reviews: p.review_count || 12,
        isNew: Boolean(p.is_new),
        isBestSeller: Boolean(p.is_best_seller),
        inStock: (p.stock_quantity || 0) > 0
      };
    });

    res.json(formattedProducts);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ error: 'Failed to retrieve products. ' + error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = id.toString().replace('mtl-', '');

    const [products] = await pool.query(
      `SELECT p.*, c.name as category_name, col.name as collection_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN collections col ON p.collection_id = col.id 
       WHERE p.id = ? OR p.slug = ?`,
      [numericId, id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const p = products[0];
    const [images] = await pool.query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY is_primary DESC',
      [p.id]
    );
    const [variants] = await pool.query(
      'SELECT * FROM product_variants WHERE product_id = ?',
      [p.id]
    );

    const formatted = {
      id: `mtl-${String(p.id).padStart(3, '0')}`,
      rawId: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      salePrice: p.sale_price ? Number(p.sale_price) : null,
      category: p.category_name,
      collection: p.collection_name,
      description: p.description,
      fabric: p.fabric,
      sizes: Array.from(new Set(variants.map(v => v.size))),
      colors: Array.from(new Set(variants.map(v => v.color))).map(c => ({ name: c, hex: getColorHex(c) })),
      images: images.map(img => img.image_url),
      rating: Number(p.rating),
      reviews: p.review_count,
      isNew: Boolean(p.is_new),
      isBestSeller: Boolean(p.is_best_seller),
      inStock: p.stock_quantity > 0
    };

    res.json(formatted);
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
};

export const getProductBySlug = async (req, res) => {
  req.params.id = req.params.slug;
  return getProductById(req, res);
};

export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, price, salePrice, categoryId, collectionId, fabric, stockQuantity, images, variants } = req.body;

    const [result] = await pool.query(
      `INSERT INTO products (name, slug, description, price, sale_price, category_id, collection_id, fabric, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug || name.toLowerCase().replace(/ /g, '-'), description, price, salePrice || null, categoryId, collectionId, fabric, stockQuantity || 50]
    );

    const productId = result.insertId;

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)',
          [productId, images[i], i === 0 ? 1 : 0]
        );
      }
    }

    res.status(201).json({ message: 'Product created successfully', productId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product. ' + error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, salePrice, description, stockQuantity } = req.body;

    await pool.query(
      'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), sale_price = ?, description = COALESCE(?, description), stock_quantity = COALESCE(?, stock_quantity) WHERE id = ?',
      [name, price, salePrice, description, stockQuantity, id]
    );

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

function getColorHex(colorName) {
  const map = {
    Ivory: '#F7F5F0',
    'Soft Taupe': '#D8CFC4',
    'Onyx Black': '#1C1B1B',
    'Dusty Rose': '#C8968C',
    'Pearl White': '#F5F3ED',
    'Sapphire Navy': '#1E2A3A',
    'Deep Emerald': '#1A4D3E',
    Terracotta: '#D4A373',
    'Antique Gold': '#C5A059',
    'Dust Rose': '#C8968C',
    'Garnet Crimson': '#7A1C22'
  };
  return map[colorName] || '#1C1B1B';
}
