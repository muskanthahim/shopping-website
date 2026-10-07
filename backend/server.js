import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import collectionRoutes from './routes/collections.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import orderRoutes from './routes/orders.js';
import healthRoutes from './routes/health.js';
import initDatabase from './scripts/initDb.js';
import { swaggerSpec } from './config/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Interactive API Docs (PHP Scramble / Swagger UI equivalent)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

// Start Express Server
app.listen(PORT, async () => {
  console.log(`=================================================`);
  console.log(`🚀 MUSKAN THE LABEL Backend API running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📚 Interactive Testing Docs (Scramble UI): http://localhost:${PORT}/docs`);
  console.log(`=================================================`);

  // Attempt MySQL auto-init
  try {
    const success = await initDatabase();
    if (success) {
      console.log(`✅ MySQL connected & schema ready for database "muskan_the_label"`);
    } else {
      console.warn(`⚠️ MySQL connection pending. Make sure MySQL server is running on localhost:3306.`);
    }
  } catch (err) {
    console.warn(`⚠️ Could not auto-initialize MySQL:`, err.message);
  }
});
