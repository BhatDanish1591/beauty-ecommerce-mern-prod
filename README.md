# 💄 Beauty Shop - Premium MERN E-commerce

A high-end, full-stack beauty e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). Featuring a premium aesthetic, luxury dark mode components, and a robust admin dashboard.

## ✨ Features

- **🛍️ Complete Shopping Flow**: Browse products, view details, and manage your cart.
- **🛡️ Secure Authentication**: JWT-based login and registration with role-based access.
- **📊 Admin Dashboard**:
  - Full CRUD operations for products.
  - View recent orders and registered customers.
  - Premium analytics cards and custom confirmation modals.
- **📱 Hyper-Responsive**: Optimized for all screen sizes, from mobile phones to 4K displays.
- **🎨 Luxury UI**: Glassmorphic elements, smooth framer-motion animations, and elegant typography.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Vanilla CSS.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (via Mongoose).
- **Security**: JWT (JSON Web Tokens), Bcrypt.js.

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or MongoDB Atlas URI)

### 2. Clone the Repository
```bash
git clone https://github.com/BhatDanish1591/beauty-ecommerce-mern-prod.git
cd beauty-ecommerce-mern-prod
```

### 3. Install Dependencies
Run the following command in the root directory to install dependencies for the root, client, and server:
```bash
npm run install-all
```

### 4. Environment Configuration

#### Server Settings
Create a `.env` file in the `server/` directory:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/beauty_shop
JWT_SECRET=your_secret_key
NODE_ENV=development
```

#### Client Settings
Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5001/api
```

### 5. Seed the Database (Optional)
To populate the database with sample products and an admin user:
```bash
cd server
npm run data:import
```
*Note: This will delete existing data before importing samples.*

### 6. Run the Application
From the root directory, you can run both the frontend and backend concurrently:
```bash
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:5001`

---

## 🔑 Admin Access
To access the Admin Dashboard:
1. Log in with an account that has `isAdmin: true`.
2. Navigate to the profile dropdown in the navbar and select **Admin Panel**.

---

## 📂 Project Structure
```text
├── client/          # React (Vite) frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   └── pages/      # Main page views
├── server/          # Node.js Express backend
│   ├── controllers/ # Logic for API endpoints
│   ├── models/      # Mongoose schemas
│   └── routes/      # API route definitions
└── README.md
```

## 🤝 Contributing
Feel free to fork this project and submit pull requests for any features or improvements!
