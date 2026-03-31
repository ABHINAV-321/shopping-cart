# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an e-commerce shopping cart application built with Node.js/Express.js using MongoDB as the database and Handlebars (hbs) for templating. The application supports user authentication, product catalog, shopping cart, order placement with Cod and Razorpay payments, and admin product management.

**Key Features:**
- User authentication (signup/login/logout with bcrypt)
- Product catalog browsing
- Shopping cart management (add, view, decrease items)
- Order placement with Cash on Delivery (COD) and Razorpay payment integration
- Admin product CRUD operations (add, edit, delete, view products)
- Session-based user management

## Tech Stack

- **Framework:** Express.js 4.18.2
- **Database:** MongoDB (MongoDB Atlas connection)
- **Templating:** Handlebars (hbs) 4.2.0
- **Authentication:** bcrypt + express-session
- **Payments:** Razorpay SDK 2.9.4
- **File Uploads:** express-fileupload
- **Development:** nodemon for hot reload

## Project Structure

```
shopping-cart/
├── app.js                 # Main Express app configuration and middleware
├── bin/
│   └── www              # HTTP server startup (port normalization)
├── Config/
│   └── connection.js    # MongoDB connection function
├── routes/
│   ├── admin.js         # Admin routes (product CRUD, view products)
│   └── users.js         # User routes (auth, cart, orders, product browsing)
├── helpers/
│   ├── Product-helpers.js  # Product database operations
│   └── user-helpers.js     # User, cart, order, payment operations
├── views/
│   ├── admin/           # Admin Handlebars templates
│   ├── user/            # User Handlebars templates
│   ├── partials/        # Reusable template partials (headers)
│   └── layout.hbs       # Main layout template
├── public/               # Static assets (CSS, images)
│   ├── images/
│   │   └── product-img/ # Product images stored here
│   └── stylesheets/
└── package.json
```

## Database Schema

**Collections in `shopping-cart` database:**

- **product:** `{ _id, name, price, category, des }`
- **user:** `{ _id, Email, Password (hashed), Name, ... }`
- **cart:** `{ _id, user (ObjectId), products: [{ product: ObjectId, Qty }] }`
- **order:** `{ _id, userId, deliveryDetails, product, paymentMethod, status }`

## Common Development Tasks

### Start the application
```bash
npm start
```
Runs `nodemon ./bin/www` - starts server on port 3000 (or PORT env var) with auto-reload.

### Access the application
- Default URL: `http://localhost:3000`
- Deployed instances listed in README.md

### Database connection
- Connection configured in `Config/connection.js`
- Uses MongoDB Atlas connection string with hardcoded credentials
- Both helper files establish their own connections using the MongoDB driver

### Admin routes (prefix: `/admin`)
- `GET /admin` - View all products
- `GET /admin/add-product` - Show add product form
- `POST /admin/add-product` - Create product with image upload
- `GET /admin/delete-product?id=<productId>` - Delete product
- `GET /admin/edit-product?id=<productId>` - Show edit form
- `POST /admin/edit-product?id=<productId>` - Update product (optional new image)

### User routes
- `GET /` - Product catalog (homepage)
- `GET /login` - Login form
- `POST /login` - Authenticate user
- `GET /signup` - Registration form
- `POST /signup` - Create user account
- `GET /logout` - Destroy session
- `GET /cart` - View cart (requires login)
- `GET /add-to-cart/:id` - Add product to cart (requires login)
- `GET /sub/:id` - Decrease cart item quantity
- `GET /order/:id` - Show order placement form (requires login)
- `POST /place-order` - Create order, handle COD or initiate Razorpay
- `POST /verify-payment` - Verify Razorpay payment signature
- `GET /order-success` - Order confirmation page

### Authentication middleware
- `loginCheck` in `routes/admin.js` (actually users.js line 6) - redirects to `/login` if `req.session.loggedIn` is false

## Important Implementation Details

### Payment Flow
1. User places order with payment method selection
2. If COD: order status set to `placed`, returns JSON `{status: true}`
3. If Razorpay: `generateRazorpay()` creates order, returns order details to frontend
4. Frontend completes payment, sends verification data to `/verify-payment`
5. `verifyPayment()` validates HMAC SHA256 signature using Razorpay key secret
6. On success, `changePaymentStatus()` updates order status to `placed`

### Cart structure
- Cart is a single document per user containing an array of products with quantities
- `addToCart`: either inserts new cart document or pushes to existing products array
- `getCartProducts`: uses MongoDB `$lookup` aggregation to join cart with product collection
- `getCartCount`: returns length of products array in user's cart

### Product Images
- Stored in `public/images/product-img/` with filename as product `_id` + `.jpg`
- Uploaded via `express-fileupload` in admin add-product route
- Images saved asynchronously after database insert; product ID returned from insertOne used as filename

### Session Configuration
- Session secret: `"key"` (hardcoded in app.js line 43)
- Session maxAge: 10 minutes (600000 ms)
- Session data: `loggedIn` (boolean), `user` (user object)

## Notes for Modification

- Database connections are created per-request in helper files - consider connection pooling improvements
- MongoDB connection string and Razorpay credentials are hardcoded (should use environment variables)
- No input validation or sanitization on user input (XSS/SQL injection risk via MongoDB operators)
- Session secret is exposed in source code
- Admin routes lack authentication middleware (anyone can access `/admin` routes)
- Image upload lacks file type validation and error handling
- `decreaseCartItem` helper is incomplete (does not update cart)

## Environment Requirements

- Node.js (version not specified)
- MongoDB Atlas account or local MongoDB instance
- Razorpay test account for payment features

## Testing

No test suite is configured. Manual testing through the browser is the current approach.
