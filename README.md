# MUSKAN THE LABEL — Production E-Commerce & MySQL Database Setup

A luxury modern Pakistani women's fashion e-commerce platform built with **React**, **Vite**, **Express.js**, and **MySQL**.

---

## 🏗️ System Architecture

```text
Frontend (React + Vite) — Port 3000
       │
       │  REST API Requests (JSON)
       ▼
Express Backend API — Port 5001
       │
       │  mysql2/promise Pool
       ▼
MySQL Database — Port 3306 (muskan_the_label)
```

---

## 📁 Project Structure

```text
ShoppingWebsite/
│
├── database/
│   ├── schema.sql              # MySQL DDL (Users, Categories, Products, Cart, Orders, etc.)
│   └── seed.sql                # Seed data (20+ Pakistani fashion items, categories, variants)
│
├── backend/
│   ├── server.js               # Express application entrypoint
│   ├── package.json            # Backend dependencies (express, mysql2, dotenv, bcryptjs, jwt)
│   ├── .env                    # Database & port environment variables
│   ├── .env.example            # Environment template
│   ├── config/
│   │   └── db.js               # mysql2/promise Connection Pool
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication verification
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── collectionController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── collections.js
│   │   ├── cart.js
│   │   ├── wishlist.js
│   │   ├── orders.js
│   │   └── health.js
│   └── scripts/
│       └── initDb.js           # Automated script to create tables and load seed data
│
└── src/                        # Frontend React Application
    ├── components/             # Navbar, Footer, ProductCard, CartDrawer, SearchOverlay, Modals
    ├── context/
    │   └── ShopContext.jsx     # Global React Context synced with Express REST API
    ├── pages/                  # HomePage, ShopPage, ProductDetailPage, WishlistPage, CheckoutPage, OrderConfirmationPage
    └── data/                   # Fallback sample dataset
```

---

## 🛠️ Step-by-Step macOS MySQL Setup

### Option 1: Homebrew (Recommended)

1. **Install MySQL via Homebrew**:
   ```bash
   brew install mysql
   ```

2. **Start the MySQL background service**:
   ```bash
   brew services start mysql
   ```

3. **Verify MySQL status**:
   ```bash
   brew services list
   ```

4. **Set Root Password (Optional)**:
   ```bash
   mysql_secure_installation
   ```

---

### Option 2: Official MySQL Installer (DMG/PKG)

1. Download the macOS DMG installer from [MySQL Official Downloads](https://dev.mysql.com/downloads/mysql/).
2. Open the package and complete the installation wizard.
3. Start MySQL from **System Settings → MySQL**.

---

## 🗄️ Database Creation & Seeding

Run the automated database initializer script from the `backend/` directory:

```bash
cd backend
npm run db:init
```

*Or manually run via MySQL CLI*:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p muskan_the_label < database/seed.sql
```

---

## ⚙️ Environment Configuration (`backend/.env`)

Configure your MySQL credentials in `backend/.env`:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD
DB_NAME=muskan_the_label
JWT_SECRET=muskan_the_label_super_secret_jwt_key_2026
```

---

## 🚀 Running the Platform

### 1. Start the Express Backend API

```bash
cd backend
npm install
npm start
```
*Backend will run at: `http://localhost:5001/api`*

### 2. Start the React Frontend

```bash
npm install
npm run dev
```
*Frontend will run at: `http://localhost:3000`*

---

## 🌐 REST API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Database health & connectivity check |
| `GET` | `/api/products` | Retrieve products (supports `search`, `category`, `minPrice`, `maxPrice`, `sort`) |
| `GET` | `/api/products/:id` | Get product details by ID or slug |
| `GET` | `/api/categories` | List all fashion categories |
| `GET` | `/api/collections` | List active brand collections |
| `GET` | `/api/cart` | Get current user's shopping bag items |
| `POST` | `/api/cart` | Add product variant to shopping bag |
| `PUT` | `/api/cart/:itemId` | Update cart item quantity |
| `DELETE` | `/api/cart/:itemId` | Remove item from cart |
| `GET` | `/api/wishlist` | Retrieve saved wishlist items |
| `POST` | `/api/wishlist` | Save item to wishlist |
| `DELETE` | `/api/wishlist/:productId` | Remove item from wishlist |
| `POST` | `/api/orders` | Place transaction-safe order & deduct stock |
| `GET` | `/api/orders/number/:orderNumber` | Get order details by order reference number |
| `POST` | `/api/auth/register` | Register customer account |
| `POST` | `/api/auth/login` | Authenticate customer & generate JWT |

---

## ✅ Transaction Safety & Server-Side Security

1. **Price Verification**: Item prices are computed on the backend directly from MySQL to prevent price tampering.
2. **Atomic Orders**: Orders use MySQL transactions (`START TRANSACTION`, `COMMIT`, `ROLLBACK`). If stock check fails or error occurs, all changes roll back safely.
3. **Stock Deductions**: Product stock quantities update automatically upon order creation (`UPDATE products SET stock_quantity = stock_quantity - ?`).
