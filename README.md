# Student Innovation & Startup Cell Portal (SISCP)

A professional, modern, and scalable full-stack web application designed for colleges to manage student startups, innovation proposals, incubation space requests, and industry mentorship.

This release represents **StudentInnovationStartupCellPortal_V1**, which implements the core JWT authentication system, a responsive grid interface, and the dashboard modules architecture.

---

## 🚀 Key Features

* **JWT Authentication:** Secure user signup and signin with passwords hashed using `bcryptjs` and credentials saved via Context API.
* **Tailwind CSS v4:** Leverages the high-performance Vite plugin `@tailwindcss/vite` and CSS-based `@theme` rules for custom typography (Outfit and Inter fonts), gradients, and interactive layouts.
* **Modern Glassmorphic UI:** Smooth hover transitions, backdrop blur modals, responsive mobile drawer menus, and custom glow animations.
* **Out-of-the-Box DB Fallback:** Runs automatically in **Database Simulation Mode** if a local MongoDB connection is unavailable. It simulates registration, validation, and login in-memory for testing with zero database setup.
* **Modular "Coming Soon" Overlay:** Integrates descriptive previews of future phases (Incubation space, mentor assign, proposal forms) using a centralized glassmorphic modal.

---

## 📂 Project Architecture

```text
StudentInnovationStartupCellPortal_V1/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Reusable layout blocks
│   │   │   ├── Navbar.jsx     # Sticky glass navigation header
│   │   │   ├── Footer.jsx     # Branding contacts footer
│   │   │   └── ComingSoonModal.jsx  # Modular popup overlay
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user auth & state provider
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page (Hero, Stats, About, Grid, Stories)
│   │   │   ├── Login.jsx      # Login page with password show/hide & Remember Me
│   │   │   └── Register.jsx   # Signup page with department dropdown list
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx  # Client routing configurations
│   │   ├── services/
│   │   │   └── api.js         # Axios interceptor for JWT authorization header
│   │   ├── App.jsx            # Main layout layout wrapper
│   │   ├── index.css          # Tailwind imports, glass panels, & animations
│   │   └── main.jsx           # React app mount
│   ├── index.html             # Main entry loading Google Fonts (Outfit & Inter)
│   ├── vite.config.js         # Dev proxy mapping and Tailwind v4 setup
│   └── package.json           # Client dependency configurations
│
└── server/                     # Node.js + Express Backend REST API
    ├── config/
    │   └── db.js              # Mongoose DB connection & 2s timeout check
    ├── controllers/
    │   └── authController.js  # Registration & Login endpoints (Mongoose / In-memory)
    ├── middleware/
    │   └── authMiddleware.js  # Token parser middleware for protected routes
    ├── models/
    │   └── User.js            # Mongoose Schema for User accounts
    ├── routes/
    │   └── authRoutes.js      # Express auth route mappings
    ├── server.js              # Server bootstrapper, CORS, & port configurations
    ├── .env                   # Active environment keys
    ├── .env.example           # Shared placeholder variables
    └── package.json           # Server dependency configurations
```

---

## ⚙️ Installation & Setup

Ensure you have [Node.js (v18+)](https://nodejs.org/) installed.

### 1. Clone & Position
Place the `client/` and `server/` folders in your workspace directory.

### 2. Configure Environment variables
The server is pre-configured with default values. To change them:
```bash
# Inside the server directory
cp .env.example .env
```
Inside `.env`:
* `PORT=5000` (Backend API Port)
* `MONGO_URI=mongodb://127.0.0.1:27017/student_startup_portal`
* `JWT_SECRET=any_secret_passphrase_key`

---

## ⚡ Running the Application

You need to run the **Backend Server** and the **Frontend Client** concurrently.

### Run Backend Server
In a terminal, navigate to the `server/` directory:
```bash
cd server
# Install packages
npm install
# Start backend in development mode (using nodemon)
npm run dev
```
*If a local MongoDB is not running, the console will log:*
`⚠️ Database Connection Error. Falling back to local in-memory simulation database for seamless testing!`

### Run Frontend Client
In a separate terminal, navigate to the `client/` directory:
```bash
cd client
# Install packages
npm install
# Start client dev server
npm run dev
```
The frontend is available locally at: **[http://localhost:3000/](http://localhost:3000/)**

---

## 🧪 Testing User Authentication Flow

1. Open **[http://localhost:3000/](http://localhost:3000/)**.
2. Click **Register** in the navbar or landing page.
3. Fill out the fields:
   * Select a department from the dropdown list (e.g. *Computer Science Engineering*).
   * Put matching passwords.
   * Click **Register Account**. Upon successful signup, you will be redirected to the landing page and logged in.
4. Try clicking **Sign Out** from the user avatar dropdown menu.
5. Go to **Log In**, check the **Remember Me** checkbox, sign in, and verify that logging out preserves your email address in the input form on return.
6. Click on any of the future modules like **Startup Register** or **Incubation Apply** in the navbar or features grid to verify that the modular **Coming Soon Overlay** opens with a description of what the module will accomplish.
