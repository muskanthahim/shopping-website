# MUSKAN THE LABEL — Developer Guide & Setup Reference

This document provides a clean, comprehensive guide for starting, configuring, and working with **MUSKAN THE LABEL** (Full-Stack E-Commerce Platform built with React, Express, and MySQL).

---

## 🛢️ Sequel Ace / Sequel Pro Connection Settings (macOS)

To view and manage your MySQL tables (`muskan_the_label`) in **Sequel Ace**:

1. Open **Sequel Ace** on your Mac.
2. Select **Standard (TCP/IP)** connection type.
3. Enter the following settings:

| Field | Value |
| :--- | :--- |
| **Name / Label** | `Muskan The Label` |
| **Host** | `127.0.0.1` |
| **Username** | `root` |
| **Password** | *(Leave blank — empty password)* |
| **Database** | `muskan_the_label` |
| **Port** | `3306` |

*Click **Connect** to open your database tables.*

---

## 📚 Interactive API Documentation & Testing (PHP Scramble Equivalent)

An interactive visual API testing console (powered by Swagger UI / OpenAPI 3.0) is mounted directly on your Express server:

* **Interactive API Testing Console**: **`http://localhost:5001/docs`**
* **Alternative URL**: **`http://localhost:5001/api-docs`**

---

## 🚀 Commands to Start the Platform

### 1. Start MySQL Database Service (macOS)
```bash
brew services start mysql
```
*To stop MySQL service when finished:* `brew services stop mysql`

### 2. Run Both Frontend and Backend Concurrently (Single Command)
Make sure you are in the **project root directory** (`ShoppingWebsite/`, **not** inside `backend/`):
```bash
# Ensure you are at the project root
cd /Users/waqar/MuskanLearning/VibeCoding/ShoppingWebsite

# Launch both servers
npm run dev:all
```
* **Frontend**: `http://localhost:3000` (automatically proxies `/api` calls to the backend)
* **Backend REST API**: `http://localhost:5001/api`
* **Interactive API Testing Console (Scramble / Swagger)**: `http://localhost:5001/docs`

---

### Alternative: Run Separately in Two Terminals

**Terminal 1 — Backend:**
```bash
npm run server:dev
# or: cd backend && npm start
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

### Database Seeder (if you need to re-seed tables):
```bash
npm run db:init
```

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

### Interactive Testing
- `GET /docs` — Interactive OpenAPI / Scramble testing console in your browser.

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

### Authentication & Customers
- `POST /api/auth/register` — Create new customer account with bcrypt hashing and JWT return
- `POST /api/auth/login` — Log in with email & password, returns JWT session token
- `GET /api/auth/me` — Retrieve active authenticated user profile (requires `Bearer <token>`)
- `PUT /api/auth/profile` — Update customer name and phone (requires `Bearer <token>`)

### Editorial Articles & Stories
- `GET /api/articles` — Retrieve live editorial articles from MySQL
- `GET /api/articles/:id` — Retrieve single article by ID

### Default Seeded Customer Accounts
- **Account 1**: `customer@muskanthelabel.com` / `password123` (Ayesha Khan)
- **Account 2**: `muskanthaheem09@gmail.com` / `password123` (Muskan Thahim)
*(You can also use the **"Create Account"** tab in the Account modal to register any new customer instantly)*
