# ELYSIAN – Full-Stack Luxury E-Commerce Platform


A complete, production-ready e-commerce platform for a luxury fashion brand, built from the ground up with a scalable FastAPI backend and a modern React frontend. This project demonstrates a full suite of features, from a dynamic product catalog and user authentication to a transactional order system and a comprehensive admin panel.

---
## ✨ Key Features

### 🤵 Customer-Facing Experience
* **Dynamic Product Discovery:** Browse products with advanced, real-time filtering by category, gender, size, colour, and price range.
* **Seamless Navigation:** Dedicated pages for Men, Women, New Arrivals, and more, all powered by a single, powerful API.
* **User Authentication:** Secure user registration and login using a JWT-based authentication system.
* **Multi-Variant Shopping Cart:** Add products with specific size and colour selections to a persistent, user-specific cart.
* **Persistent Wishlist:** Save favorite items for later.
* **Transactional Checkout:** A robust "Create Order" process that converts the user's cart into a permanent order and clears the cart atomically.
* **Order History:** A dedicated page for logged-in users to view their past orders and current order statuses.
* **Fully Responsive Design:** A sleek, modern UI built with Tailwind CSS that looks great on all devices.

### 👑 Admin Panel
* **Secure Admin Login:** A separate, protected login for administrators.
* **Dashboard Analytics:** A central dashboard providing key business metrics, including total income, sales volume, product counts, and customer counts.
* **Full Product Management:** A complete CRUD interface for creating, updating, and "soft deleting" products, including managing images, stock, and pricing.
* **Dynamic Catalog Management:** Admins can add, edit, or delete categories, sizes, and colours on the fly, which are then immediately reflected on the public-facing site.
* **Comprehensive Order Management:** View all customer orders, see detailed order information, and update order statuses (e.g., "Processing" to "Shipped").
* **Paginated Tables:** All admin tables are paginated to handle a large number of products and orders efficiently.

---

## 🛠️ Tech Stack & Architecture

This project was built using a modern, decoupled, full-stack architecture.

### **Backend (Python)**
* **Framework:** **FastAPI** for its high performance and automatic API documentation.
* **Database:** **PostgreSQL** for its robust relational data integrity.
* **ORM:** **SQLAlchemy** for powerful, object-oriented database interaction.
* **Migrations:** **Alembic** for managing the entire database schema lifecycle.
* **Authentication:** **JWT** tokens with **OAuth2** (Password Bearer flow) and `passlib` (bcrypt) for secure password hashing.
* **Data Validation:** **Pydantic** for creating clear, safe, and validated API contracts.

### **Frontend (JavaScript)**
* **Framework:** **React** (with Vite) for a fast, component-based UI.
* **State Management:** **Redux Toolkit** & **RTK Query** for centralized, efficient, and real-time server state management, including caching and optimistic updates.
* **Styling:** **Tailwind CSS** & **Shadcn UI** for a utility-first, modern, and fully responsive design.
* **UI/UX:** **Framer Motion** for smooth animations and **Lucide React** for icons.
* **Notifications:** **React Hot Toast** for user-friendly feedback.

### **Architectural Highlights**
* **3-Tier Backend Architecture:** The backend is strictly organized into **API**, **Service**, and **CRUD** layers, ensuring a clean separation of concerns, high testability, and easy maintenance.
* **RESTful API Design:** The API follows professional REST principles, using a single, powerful endpoint with query parameters for filtering, sorting, and pagination.
* **DRY (Don't Repeat Yourself) Principle:** Reusable components on the frontend and a modular service layer on the backend prevent code duplication and improve scalability.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### **Prerequisites**
* Python 3.10+
* Node.js 18+
* PostgreSQL

### **Backend Setup**
1.  Navigate to the `Backend` directory:
    ```sh
    cd Backend
    ```
2.  Create and activate a virtual environment:
    ```sh
    python -m venv back
    source back/bin/activate  # On Windows, use: back\Scripts\activate
    ```
3.  Install the required Python packages:
    ```sh
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `Backend` directory and add your database URL and a secret key:
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/fashion_db"
    SECRET_KEY="your_super_secret_key_here"
    ```
5.  Apply the database migrations:
    ```sh
    alembic upgrade head
    ```
6.  Seed the database with an admin user and initial data:
    ```sh
    python -m app.db.init_db
    ```
7.  Run the FastAPI server:
    ```sh
    uvicorn app.main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### **Frontend Setup**
1.  Navigate to the `Frontend` directory:
    ```sh
    cd Frontend
    ```
2.  Install the required NPM packages:
    ```sh
    npm install
    ```
3.  Run the Vite development server:
    ```sh
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.
