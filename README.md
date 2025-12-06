# 🛒 MFU 2ndHand Marketplace - E-commerce MVP

A complete, production-ready e-commerce application built with modern web technologies. This marketplace allows users to buy and sell pre-loved items with a professional shopping experience.

![E-commerce Platform](https://img.shields.io/badge/Status-Production%20Ready-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Stripe](https://img.shields.io/badge/Stripe-Integrated-purple)

## 🌟 Features

### ✅ Core E-commerce Functionality
- **🛒 Shopping Cart System** - Full cart management with database persistence
- **🔐 User Authentication** - Secure login/register with role-based access
- **📱 Product Catalog** - Browse and search products with filtering
- **💳 Payment Processing** - Stripe integration for secure payments
- **📦 Order Management** - Complete order tracking and status updates
- **👥 Multi-Role System** - Buyers, Sellers, and Admin roles
- **🎨 Professional UI/UX** - Modern, responsive design

### 🛠 Technical Features
- **🏗 Modern Architecture** - Next.js frontend + NestJS backend
- **🗄️ Database Integration** - PostgreSQL with Prisma ORM
- **🔒 Security** - JWT authentication and role-based access control
- **📊 State Management** - React Context for cart and auth
- **🎯 Type Safety** - Full TypeScript implementation
- **📱 Responsive Design** - Mobile-first approach
- **🚀 Performance** - Optimized for speed and scalability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Stripe account for payments

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sannyuntwin/mfu-2ndhand.git
   cd mfu-2ndhand
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your database URL and Stripe keys in .env
   npx prisma migrate dev
   npx prisma generate
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Seed Test Data**
   ```bash
   cd backend
   npx ts-node create-test-data.ts
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Production Mode
```bash
# Build and run backend
cd backend && npm run build && npm run start:prod

# Build and run frontend
cd frontend && npm run build && npm run start
```

## 📋 Test Accounts

The application comes with pre-configured test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Buyer** | alice.buyer@example.com | password123 | Test buyer account |
| **Buyer** | bob.buyer@example.com | password123 | Test buyer account |
| **Seller** | john.seller@example.com | password123 | Test seller account |
| **Seller** | sarah.seller@example.com | password123 | Test seller account |
| **Admin** | admin@example.com | admin123 | Admin user account |

## 🛍 Sample Products

The database includes 5 test products:
- iPhone 15 Pro Max ($1,199.99)
- MacBook Air M3 ($1,099.99)
- Clean Code Book ($39.99)
- Bluetooth Headphones ($199.99)
- Organic Cotton T-Shirt ($29.99)

## 📁 Project Structure

```
mfu-2ndhand/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── products/       # Product management
│   │   ├── cart/           # Shopping cart API
│   │   ├── payments/       # Stripe integration
│   │   ├── orders/         # Order management
│   │   ├── buyer/          # Buyer functionality
│   │   └── seller/         # Seller functionality
│   └── prisma/             # Database schema & migrations
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript definitions
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mfu_marketplace
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🧪 Testing

### API Testing
- Backend API documentation available at `/docs` (Swagger)
- Test scripts included in `backend/test-api.sh`
- Comprehensive API testing report in `backend/API-TEST-REPORT.md`

### Frontend Testing
- Manual testing guide in `frontend/FRONTEND-TEST-REPORT.md`
- All pages tested for functionality and responsiveness
- User acceptance testing completed

## 🎯 User Journey

1. **Browse Products** → View catalog with filtering and search
2. **User Registration** → Create buyer/seller account
3. **Authentication** → Secure login with role-based access
4. **Add to Cart** → Shopping cart with quantity management
5. **Checkout** → Secure payment processing with Stripe
6. **Order Tracking** → Real-time order status updates
7. **Seller Dashboard** → Manage products and view sales
8. **Admin Panel** → User and order management

## 📊 Database Schema

The application uses a comprehensive database schema with:
- **Users** - Authentication and role management
- **Products** - Product catalog with seller relationships
- **Cart & CartItems** - Persistent shopping cart
- **Orders & OrderItems** - Complete order management
- **Payments** - Stripe payment tracking
- **Reviews** - Product review system (extensible)

## 🚀 Deployment

### Backend Deployment
- Configure production database URL
- Set up environment variables
- Deploy to platforms like Railway, Heroku, or DigitalOcean
- Configure Stripe webhooks for production

### Frontend Deployment
- Deploy to Vercel, Netlify, or similar platforms
- Configure production API URL
- Set up custom domain (optional)

### Database
- PostgreSQL on platforms like Supabase, Railway, or DigitalOcean
- Run migrations: `npx prisma migrate deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please check:
- 📚 Documentation in `/docs` folder
- 🧪 Test reports for troubleshooting
- 🐛 Issues and bug reports

## 🎉 Acknowledgments

- Built with modern web technologies
- Inspired by successful e-commerce platforms
- Designed for scalability and maintainability
- Production-ready code quality

---

**MFU 2ndHand Marketplace** - Transforming second-hand shopping with technology! 🛒✨
