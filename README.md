# **📦 MFU 2nd Hand Marketplace**

A modern full-stack marketplace for buying and selling second-hand items.
Built with a clean UI, secure backend services, and a complete e-commerce workflow.

---

## **📚 Overview**

The **MFU 2nd Hand Marketplace** connects buyers and sellers of pre-owned goods.
It includes authentication, product listings, payments, reviews, favorites, notifications, and role-based access.

---

## **✨ Features**

### **👤 User Management**

* 🔐 JWT authentication
* 👥 Buyer & Seller roles
* 🧾 User profiles + order history

### **🛍️ Product Management**

* ➕ Add / ✏️ Edit / ❌ Delete products
* 🖼️ Cloudinary image uploads
* 🏷️ Categories & filtering
* 📄 Product details with price, images, and descriptions

### **🛒 E-Commerce**

* 🔎 Advanced search & filters
* 🛒 Shopping cart (persistent)
* 💳 Stripe payment integration
* 📦 Order lifecycle (Pending → Delivered)
* 🔔 Real-time status updates

### **⭐ Social Features**

* 📝 Reviews & ratings
* ❤️ Favorites / wishlist
* 🔔 Notifications

### **⚙️ Technical Features**

* 📱 Responsive UI (Tailwind CSS)
* ⚡ SWR real-time fetching
* 🔌 REST API with NestJS
* 🗄️ PostgreSQL + Prisma

---

## **🧱 Tech Stack**

### **🖥️ Frontend**

* ⚛️ Next.js
* 🔷 TypeScript
* 🎨 Tailwind CSS
* 🔄 SWR
* 📡 Axios

### **🛠️ Backend**

* 🟦 NestJS
* 🔷 TypeScript
* 🗄️ PostgreSQL & Prisma
* 🔐 JWT Auth
* 💳 Stripe
* ☁️ Cloudinary

### **📦 DevOps**

* 🐳 Docker & Docker Compose
* 🔥 PM2
* 🔄 Prisma Migrate

---

## **🚀 Quick Start (Docker Recommended)**

```bash
git clone <repository-url>
cd mfu-2ndhand
```

### **🐳 Start DB**

```bash
docker-compose up -d postgres
```

### **🛠️ Backend Setup**

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run start:dev
```

### **💻 Frontend Setup**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

📍 **Frontend:** [http://localhost:3000](http://localhost:3000)
📍 **Backend API:** [http://localhost:3001](http://localhost:3001)
📍 **Prisma Studio:** [http://localhost:5000](http://localhost:5000)

---

## **🧩 Environment Variables**

### **🔙 Backend**

```
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### **🔝 Frontend**

```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## **📘 API Overview**

### **🔐 Authentication**

| Method | Endpoint         | Description |
| ------ | ---------------- | ----------- |
| POST   | `/auth/register` | ✍️ Register |
| POST   | `/auth/login`    | 🔑 Login    |

### **🛍️ Products**

| Method | Endpoint        | Description     | Role   |
| ------ | --------------- | --------------- | ------ |
| GET    | `/products`     | 📦 All products | -      |
| POST   | `/products`     | ➕ Create        | Seller |
| PUT    | `/products/:id` | ✏️ Update       | Seller |
| DELETE | `/products/:id` | ❌ Delete        | Seller |

### **🛒 Cart**

| Method | Endpoint          | Description  |
| ------ | ----------------- | ------------ |
| GET    | `/cart`           | 🛒 View cart |
| POST   | `/cart/items`     | ➕ Add item   |
| PUT    | `/cart/items/:id` | 🔄 Update    |
| DELETE | `/cart/items/:id` | ❌ Remove     |

### **📦 Orders**

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/orders`            | 🧾 Create order  |
| GET    | `/orders`            | 📦 User orders   |
| PUT    | `/orders/:id/status` | 🔄 Update status |

### **⭐ Reviews**

| Method | Endpoint                | Description   |
| ------ | ----------------------- | ------------- |
| GET    | `/reviews/products/:id` | ⭐ Get reviews |
| POST   | `/reviews/products/:id` | ➕ Add review  |
| PUT    | `/reviews/:id`          | ✏️ Edit       |
| DELETE | `/reviews/:id`          | ❌ Delete      |

---

## **🚀 Deployment**

### **🛠️ Backend**

```bash
npm run build
npx prisma migrate deploy
npm run start:prod
```

Or with PM2:

```bash
pm2 start dist/main.js --name backend
```

### **🌐 Frontend**

```bash
npm run build
```

Deploy via:

* ▲ Vercel
* 🌐 Netlify
* 🖥️ Nginx / Apache

### **🐳 Docker Production**

```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## **🧪 Testing**

### **Backend**

```bash
npm run test
npm run test:cov
npm run test:e2e
```

### **Frontend**

```bash
npm run test
```

---

## **❗ Troubleshooting**

### ❌ DB connection errors

✔ Check PostgreSQL
✔ Check `DATABASE_URL`

### ❌ JWT errors

✔ Ensure `JWT_SECRET` exists

### ❌ Stripe issues

✔ Verify Stripe keys

### ❌ Image upload failed

✔ Check Cloudinary credentials

---

## **🤝 Contributing**

1. 🍴 Fork repo
2. 🌱 Create feature branch
3. 💬 Conventional commit message
4. 🚀 Push
5. 🔥 Open Pull Request

---

## **📄 License**

Licensed under the **ISC License**.

---


