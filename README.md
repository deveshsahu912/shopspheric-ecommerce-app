# ShopSpheric - Full Stack MERN E-Commerce Application

ShopSpheric is a complete, production-ready, but beginner-friendly Full-Stack MERN (MongoDB, Express, React, Node.js) E-Commerce Web Application. It contains complete authentication, product management, cart and wishlist tracking, checkout order registration, and a responsive administrative dashboard.

## 🛠️ Technology Stack

* **Database:** MongoDB with Mongoose object modeling and schema validation
* **Backend:** Node.js & Express.js REST APIs with structured MVC patterns
* **Frontend:** React.js (Vite configuration), React Router (v6 SPA client routing)
* **API Client:** Axios with auto-injection JWT request interceptors
* **State Management:** React Context API (Auth, Cart, and Wishlist providers)
* **Styling:** Vanilla CSS design system with custom property variables, layout flex/grids, and theme toggling
* **Security:** JSON Web Tokens (JWT), bcrypt password hashing, CORS, and centralized exception handling

---

## 📂 Project Folder Structure

```
my-first-project/
├── package.json              # Workspace script runner orchestrating both servers
├── README.md                 # Project guide and API specifications
├── backend/
│   ├── .env                  # Port, MongoDB URI, and JWT Secrets
│   ├── server.js             # Express application initialization
│   ├── config/
│   │   └── db.js             # Mongoose MongoDB connection establishment
│   ├── models/
│   │   ├── User.js           # Users (Customer and Admin schema)
│   │   ├── Product.js        # Products (Ratings, Reviews subdocuments)
│   │   ├── Category.js       # Product Categories
│   │   ├── Cart.js           # Shopping Cart items persistence
│   │   ├── Wishlist.js       # Wishlist saved items
│   │   └── Order.js          # Placed orders details
│   ├── middleware/
│   │   ├── auth.js           # JWT verification & admin role validators
│   │   └── errorHandler.js   # Fallback 404 & Centralized exception formatters
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, session checkers
│   │   ├── productController.js  # Dynamic sorting, pagination, review CRUDs
│   │   ├── categoryController.js # Category fetching & management
│   │   ├── cartController.js     # Customer cart increments & syncs
│   │   ├── wishlistController.js # Wishlist toggles
│   │   ├── orderController.js    # Order placing, stock deductions, status updates
│   │   └── userController.js     # User profile and security changes
│   ├── routes/
│   │   └── [domain]Routes.js # Express router maps
│   └── data/
│       ├── dummyData.js      # Seeding dataset definition
│       └── seeder.js         # Wipe & Seed script runner
└── frontend/
    ├── package.json          # React Vite configurations & dependencies
    ├── vite.config.js        # Vite configurations (Reverse proxy for API requests)
    ├── index.html            # Main HTML skeleton containing Google Fonts
    └── src/
        ├── main.jsx          # DOM rendering entry point
        ├── App.jsx           # App layout, routing bindings, and guards
        ├── index.css         # Modern styling rules and dark mode variables
        ├── utils/
        │   └── api.js        # Axios instance configured with JWT interceptors
        ├── context/
        │   ├── AuthContext.jsx  # Active user, profile changes, dark mode
        │   ├── CartContext.jsx  # Cart increments, tax/shipping math
        │   └── WishlistContext.jsx # Saved wishlist listings
        ├── components/       # Custom reusable layouts (Navbar, Card, Sidebar, Loader, Toast, Modal)
        └── pages/            # View pages (Home, Catalogue, Details, Admin Dashboard, checkout)
```

---

## ⚡ Setup & Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and [MongoDB](https://www.mongodb.com/) running locally on your computer.

### Step 1: Install Dependencies
Run the install command from the root directory to install the workspace orchestration packages and trigger sub-folder setups:
```bash
npm run install-all
```
This command installs packages concurrently for the Workspace Root, `/backend`, and `/frontend`.

### Step 2: Seed the Database
Seed MongoDB with sample categories, users, and products (20 items, 5 categories, 1 admin, 5 normal users):
```bash
npm run seed
```
This runs the database seeder script `backend/data/seeder.js` to wipe existing collections and import the dummy datasets.

### Step 3: Run the Application
Start the concurrent development runner:
```bash
npm run dev
```
* **Frontend client** launches at: `http://localhost:5173/`
* **Backend API** launches at: `http://localhost:5000/`

---

## 🛡️ Default Seed Credentials

Use these credentials to evaluate user roles:
* **Administrator Profile:**
  * **Email:** `admin@example.com`
  * **Password:** `adminpassword123`
* **Standard Customer Profile:**
  * **Email:** `john@example.com`
  * **Password:** `userpassword123`

---

## 🛰️ REST API Documentation

### 🔑 Authentication Routes
* `POST /api/auth/register` - Create new customer account.
* `POST /api/auth/login` - Validate credentials, sign JWT token.
* `POST /api/auth/logout` - Clear user session.
* `GET /api/auth/me` - Fetch profile of logged-in user (*Requires Authentication Header*).

### 🏷️ Category Routes
* `GET /api/categories` - Fetch all categories.
* `GET /api/categories/:id` - Fetch single category details.
* `POST /api/categories` - Create new category (*Requires Admin*).
* `PUT /api/categories/:id` - Update category details (*Requires Admin*).
* `DELETE /api/categories/:id` - Delete category (*Requires Admin*).

### 📦 Product Routes
* `GET /api/products` - Get products (Supports page number query, search keyword, category sorting).
* `GET /api/products/:id` - Get product specifications and related items.
* `POST /api/products` - Create catalog item (*Requires Admin*).
* `PUT /api/products/:id` - Update product data (*Requires Admin*).
* `DELETE /api/products/:id` - Delete item (*Requires Admin*).
* `POST /api/products/:id/reviews` - Add review and star ratings (*Requires Auth*).

### 🛒 Cart Routes (*All Require Authentication*)
* `GET /api/cart` - Fetch user's cart.
* `POST /api/cart` - Add/Increment item in cart.
* `PUT /api/cart/:productId` - Modify quantity of cart item.
* `DELETE /api/cart/:productId` - Remove item from cart.

### 💖 Wishlist Routes (*All Require Authentication*)
* `GET /api/wishlist` - Get wishlist items.
* `POST /api/wishlist` - Toggle product save state.
* `DELETE /api/wishlist/:productId` - Remove product from saved list.

### 📝 Order Routes (*All Require Authentication*)
* `POST /api/orders` - Place order (COD default, reduces stock, clears cart).
* `GET /api/orders/myorders` - List current customer's order history.
* `GET /api/orders/:id` - Get invoice details (*Access permitted to owner and admins*).
* `GET /api/orders` - Fetch all system orders (*Requires Admin*).
* `PUT /api/orders/:id/status` - Modify shipping status (*Requires Admin*).

### 👤 User Routes (*All Require Authentication*)
* `PUT /api/users/profile` - Update profile name, email, phone, and address.
* `PUT /api/users/password` - Validate current password and set new password.
* `GET /api/users` - Fetch users directory (*Requires Admin*).
* `DELETE /api/users/:id` - Delete user account (*Requires Admin*).
* `PUT /api/users/:id/role` - Toggle User / Admin role privileges (*Requires Admin*).
