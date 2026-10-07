# MUSKAN THE LABEL — Developer Guide & Setup Reference

This document provides a clean, comprehensive guide for starting, configuring, and working with **MUSKAN THE LABEL** (Full-Stack E-Commerce Platform built with React, Express, and MySQL).

---

## 🚀 Commands to Start the Platform

### 1. Start MySQL Database Service (macOS)
```bash
brew services start mysql
```
*To stop MySQL service when finished:* `brew services stop mysql`

### 2. Initialize or Re-seed MySQL Database
```bash
cd backend
npm run db:init
```

### 3. Start Express REST API Backend
```bash
cd backend
npm start
```
*Runs at:* `http://localhost:5001/api`

### 4. Start React Frontend Development Server
```bash
# From root directory
npm run dev
```
*Runs at:* `http://localhost:3000`

---

## ⚙️ Environment Configuration (`backend/.env`)

```env
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=muskan_the_label
JWT_SECRET=muskan_the_label_super_secret_jwt_key_2026
```

---

## 🌐 Complete REST API Endpoint Reference

### Health Check
- `GET /api/health` — Checks Express server connection to local MySQL instance.

### Products
- `GET /api/products` — Retrieve all products with optional filters:
  - Query parameters: `search`, `category`, `collection`, `minPrice`, `maxPrice`, `size`, `color`, `sort`, `page`, `limit`
  - Example: `http://localhost:5001/api/products?category=Lawn&sort=price_asc`
- `GET /api/products/:id` — Get product details by ID (e.g. `mtl-001` or `1`)
- `GET /api/products/slug/:slug` — Get product details by URL slug
- `POST /api/products` — Create new product
- `PUT /api/products/:id` — Update existing product
- `DELETE /api/products/:id` — Delete product

### Categories & Collections
- `GET /api/categories` — List all categories (*Lawn*, *Festive Wear*, *Kurta Sets*, *Velvet*, *Essentials*, etc.)
- `GET /api/collections` — List all collections (*Autumn Edit '26*, *Royal Silk*, *Modern Heritage*, *Daily Luxe*)

### Shopping Bag (Cart)
- `GET /api/cart` — Get shopping bag line items and server-computed subtotal
- `POST /api/cart` — Add product variant to shopping bag
- `PUT /api/cart/:itemId` — Update cart item quantity
- `DELETE /api/cart/:itemId` — Remove item from cart
- `DELETE /api/cart` — Clear entire shopping bag

### Wishlist
- `GET /api/wishlist` — Retrieve saved wishlist items
- `POST /api/wishlist` — Save product to wishlist
- `DELETE /api/wishlist/:productId` — Remove product from wishlist

### Orders & Checkout
- `POST /api/orders` — Submit transaction-safe order, verify prices, reduce product stock, and return reference `MTL-2026-XXXX`
- `GET /api/orders` — List customer order history
- `GET /api/orders/number/:orderNumber` — Get order summary by reference number

### Authentication
- `POST /api/auth/register` — Create new customer account
- `POST /api/auth/login` — Log in and receive JWT session token
- `GET /api/auth/me` — Retrieve active user profile

---

## 📁 Project Architecture & Sitemap

```text
ShoppingWebsite/
├── DEVELOPER_GUIDE.md     # Developer Guide & API Reference (This File)
├── README.md               # Overview & MySQL setup guide
├── database/
│   ├── schema.sql          # MySQL database schema (12 tables)
│   └── seed.sql            # Seed dataset (20 products, categories, variants)
├── backend/
│   ├── server.js           # Express API server (Port 5001)
│   ├── .env                # Database & JWT configuration
│   ├── config/db.js        # mysql2 connection pool
│   ├── controllers/        # REST API Controllers
│   ├── routes/             # Express Routers
│   └── scripts/initDb.js   # DB Initializer script
└── src/                    # Frontend React App (Vite + Tailwind)
    ├── components/         # Navbar, Footer, ProductCard, CartDrawer, Modals
    ├── context/ShopContext # React state & REST API sync
    └── pages/              # Home, Shop, ProductDetail, Wishlist, Checkout, OrderConfirmation
```
