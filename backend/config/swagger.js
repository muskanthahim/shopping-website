import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MUSKAN THE LABEL — API Documentation & Testing Console',
    version: '1.0.0',
    description: `
Interactive REST API testing interface for **Muskan The Label** (PHP Scramble / Swagger UI equivalent for Node.js Express).

### How to use this documentation:
1. Explore endpoints under **Products**, **Categories**, **Cart**, **Wishlist**, **Orders**, and **Auth**.
2. Click **"Try it out"** on any endpoint to send live requests to your MySQL database.
3. Use the **Authorize 🔓** button at the top to set your JWT token for protected routes.
    `,
    contact: {
      name: 'Muskan The Label Engineering Team'
    }
  },
  servers: [
    {
      url: 'http://localhost:5001/api',
      description: 'Local Express Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token generated from /api/auth/login or /api/auth/register'
      }
    },
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'mtl-001' },
          rawId: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Ivory Bloom Set' },
          slug: { type: 'string', example: 'ivory-bloom-set' },
          price: { type: 'number', example: 5499 },
          salePrice: { type: 'number', example: 4899 },
          category: { type: 'string', example: 'Lawn' },
          collection: { type: 'string', example: "Autumn Edit '26" },
          description: { type: 'string', example: 'An effortless 3-piece lawn suit...' },
          fabric: { type: 'string', example: 'Swiss Lawn with Silk Chiffon Dupatta' },
          sizes: { type: 'array', items: { type: 'string' }, example: ['XS', 'S', 'M', 'L', 'XL'] },
          colors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Ivory' },
                hex: { type: 'string', example: '#F7F5F0' }
              }
            }
          },
          images: { type: 'array', items: { type: 'string' } },
          rating: { type: 'number', example: 4.9 },
          reviews: { type: 'integer', example: 28 },
          isNew: { type: 'boolean', example: true },
          isBestSeller: { type: 'boolean', example: true },
          inStock: { type: 'boolean', example: true }
        }
      },
      OrderRequest: {
        type: 'object',
        required: ['customerName', 'customerEmail', 'customerPhone', 'shippingAddress', 'city', 'province'],
        properties: {
          customerName: { type: 'string', example: 'Ayesha Khan' },
          customerEmail: { type: 'string', example: 'ayesha.khan@example.com' },
          customerPhone: { type: 'string', example: '+92 300 1234567' },
          shippingAddress: { type: 'string', example: 'House 42, Block 5, Clifton' },
          city: { type: 'string', example: 'Karachi' },
          province: { type: 'string', example: 'Sindh' },
          postalCode: { type: 'string', example: '75600' },
          paymentMethod: { type: 'string', example: 'Cash on Delivery' },
          promoCode: { type: 'string', example: 'MUSKAN10' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'mtl-001' },
                quantity: { type: 'integer', example: 1 },
                size: { type: 'string', example: 'M' },
                color: { type: 'string', example: 'Ivory' }
              }
            }
          }
        }
      },
      CartAddRequest: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: { type: 'string', example: 'mtl-001' },
          size: { type: 'string', example: 'M' },
          color: { type: 'string', example: 'Ivory' },
          quantity: { type: 'integer', example: 1 }
        }
      },
      UserRegister: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Ayesha Khan' },
          email: { type: 'string', example: 'ayesha.khan@example.com' },
          password: { type: 'string', example: 'password123' },
          phone: { type: 'string', example: '+92 300 1234567' }
        }
      },
      UserLogin: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'customer@muskanthelabel.com' },
          password: { type: 'string', example: 'password123' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check Express connection to MySQL database',
        responses: {
          200: { description: 'MySQL is connected' },
          533: { description: 'Database disconnected' }
        }
      }
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products with filters & sorting',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search term (e.g. Lawn, Velvet)' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category name or slug' },
          { name: 'collection', in: 'query', schema: { type: 'string' }, description: 'Collection name' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['featured', 'price-low', 'price-high', 'newest', 'best-selling'] } }
        ],
        responses: {
          200: {
            description: 'Array of formatted products',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          201: { description: 'Product created' }
        }
      }
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product details by ID or slug',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'mtl-001' }
        ],
        responses: {
          200: { description: 'Product object' },
          404: { description: 'Product not found' }
        }
      }
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all fashion categories',
        responses: { 200: { description: 'List of categories' } }
      }
    },
    '/collections': {
      get: {
        tags: ['Collections'],
        summary: 'Get all brand collections',
        responses: { 200: { description: 'List of collections' } }
      }
    },
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get shopping bag line items & server-calculated subtotal',
        responses: { 200: { description: 'Cart content' } }
      },
      post: {
        tags: ['Cart'],
        summary: 'Add item to shopping bag',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CartAddRequest' }
            }
          }
        },
        responses: { 200: { description: 'Updated cart items' } }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Clear shopping bag',
        responses: { 200: { description: 'Cart cleared' } }
      }
    },
    '/cart/{itemId}': {
      put: {
        tags: ['Cart'],
        summary: 'Update cart item quantity',
        parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { quantity: { type: 'integer', example: 2 } } }
            }
          }
        },
        responses: { 200: { description: 'Updated' } }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove single item from cart',
        parameters: [{ name: 'itemId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Item removed' } }
      }
    },
    '/wishlist': {
      get: {
        tags: ['Wishlist'],
        summary: 'Get saved wishlist product IDs',
        responses: { 200: { description: 'Wishlist product IDs' } }
      },
      post: {
        tags: ['Wishlist'],
        summary: 'Save product to wishlist',
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { productId: { type: 'string', example: 'mtl-001' } } }
            }
          }
        },
        responses: { 200: { description: 'Saved to wishlist' } }
      }
    },
    '/wishlist/{productId}': {
      delete: {
        tags: ['Wishlist'],
        summary: 'Remove product from wishlist',
        parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' }, example: 'mtl-001' }],
        responses: { 200: { description: 'Removed from wishlist' } }
      }
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Place transaction-safe order & deduct stock',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/OrderRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Order created with reference MTL-2026-XXXX' },
          400: { description: 'Validation error or out of stock' }
        }
      },
      get: {
        tags: ['Orders'],
        summary: 'Get user order history',
        responses: { 200: { description: 'Array of past orders' } }
      }
    },
    '/orders/number/{orderNumber}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order details by reference number',
        parameters: [{ name: 'orderNumber', in: 'path', required: true, schema: { type: 'string' }, example: 'MTL-2026-3042' }],
        responses: { 200: { description: 'Order details & line items' } }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register customer account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserRegister' }
            }
          }
        },
        responses: { 201: { description: 'User created & token issued' } }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Log in customer & get JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserLogin' }
            }
          }
        },
        responses: { 200: { description: 'Token returned' } }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        summary: 'Get active logged-in user profile',
        responses: { 200: { description: 'User profile object' } }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);
