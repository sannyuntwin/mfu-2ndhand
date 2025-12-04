# MFU 2nd Hand Marketplace

A comprehensive full-stack e-commerce platform for second-hand goods, enabling users to buy and sell pre-owned items securely and efficiently. Built with modern technologies to provide a seamless marketplace experience.

## Overview

The MFU 2nd Hand Marketplace is a web application that connects buyers and sellers of second-hand goods. It features user authentication, product management, shopping cart functionality, secure payments via Stripe, product reviews, favorites, notifications, and more. The platform supports role-based access control with buyer and seller roles, allowing sellers to list and manage their products while buyers can browse, purchase, and review items.

## Features

### User Management
- **Authentication & Authorization**: JWT-based authentication with role-based access control (Buyer/Seller)
- **User Roles**: Separate interfaces and permissions for buyers and sellers
- **Profile Management**: User profiles with order history and preferences

### Product Management
- **Product Listings**: Sellers can create, update, and delete product listings
- **Rich Product Details**: Title, description, price, images, and categorization
- **Image Upload & Processing**: Cloudinary integration for optimized image handling
- **Category Organization**: Hierarchical categories for better product discovery

### E-Commerce Functionality
- **Advanced Search & Filtering**: Search by keywords, filter by category, price range, and more
- **Shopping Cart**: Persistent cart functionality with quantity management
- **Secure Checkout**: Integrated Stripe payment processing with payment intent handling
- **Order Management**: Complete order lifecycle from pending to delivered
- **Order Status Tracking**: Real-time updates on order status (Pending, Confirmed, Shipped, Delivered, Cancelled)

### Social Features
- **Product Reviews & Ratings**: Users can leave reviews and ratings (with seller moderation)
- **Favorites/Wishlist**: Save favorite products for later
- **Notifications**: System notifications for orders, reviews, and important updates

### Technical Features
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Real-time Updates**: Efficient data fetching with SWR
- **API Architecture**: RESTful API built with NestJS
- **Database**: PostgreSQL with Prisma ORM for robust data management

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport.js
- **Payments**: Stripe API
- **Image Processing**: Sharp + Cloudinary
- **Validation**: class-validator

### Frontend
- **Framework**: Next.js (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + SWR
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### DevOps
- **Containerization**: Docker & Docker Compose
- **Process Management**: PM2 (for production)
- **Database Migrations**: Prisma Migrate

## Setup Instructions

### Prerequisites

- Node.js 16 or higher
- PostgreSQL 15 or higher
- Docker & Docker Compose (optional, for containerized setup)
- Cloudinary account (for image uploads)
- Stripe account (for payment processing)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mfu-2ndhand
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d postgres
   ```

3. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env  # Configure your environment variables
   npm install
   npx prisma migrate dev
   npm run start:dev
   ```

4. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   cp .env.example .env  # Configure your environment variables
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database Admin: http://localhost:5000 (Prisma Studio)

### Manual Setup (without Docker)

#### Database Setup
```bash
# Install PostgreSQL and create database
createdb mfu_marketplace

# Or using Docker for database only
docker run --name mfu-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=mfu_marketplace -p 5432:5432 -d postgres:15
```

#### Backend Configuration
```bash
cd backend
npm install

# Create .env file with required variables:
DATABASE_URL="postgresql://postgres:password@localhost:5432/mfu_marketplace"
JWT_SECRET="your-super-secret-jwt-key"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

npx prisma migrate dev
npm run start:dev
```

#### Frontend Configuration
```bash
cd frontend
npm install

# Create .env.local file:
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mfu_marketplace
JWT_SECRET=your-jwt-secret-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

## API Documentation

The API follows RESTful conventions and uses JSON for request/response bodies. All endpoints require authentication except for product browsing and user registration.

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |

### Product Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/products` | Get all products (with filtering) | No | - |
| GET | `/products/:id` | Get product details | No | - |
| POST | `/products` | Create new product | Yes | Seller |
| PUT | `/products/:id` | Update product | Yes | Seller |
| DELETE | `/products/:id` | Delete product | Yes | Seller |

**Query Parameters for GET /products:**
- `search`: Search term
- `category`: Category ID
- `minPrice` & `maxPrice`: Price range
- `page` & `limit`: Pagination

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user's cart | Yes |
| POST | `/cart/items` | Add item to cart | Yes |
| PUT | `/cart/items/:id` | Update cart item | Yes |
| DELETE | `/cart/items/:id` | Remove cart item | Yes |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order | Yes |
| GET | `/orders` | Get user's orders | Yes |
| GET | `/orders/:id` | Get order details | Yes |
| PUT | `/orders/:id/status` | Update order status | Yes (Admin/Seller) |

### Review Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/reviews/products/:productId` | Get product reviews | No | - |
| POST | `/reviews/products/:productId` | Create review | Yes | Buyer |
| PUT | `/reviews/:id` | Update review | Yes | Review Owner |
| DELETE | `/reviews/:id` | Delete review | Yes | Review Owner |
| PUT | `/reviews/:id/moderate` | Moderate review | Yes | Seller |

### Favorites Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/favorites` | Get user's favorites | Yes |
| POST | `/favorites` | Add to favorites | Yes |
| DELETE | `/favorites/:productId` | Remove from favorites | Yes |
| GET | `/favorites/check/:productId` | Check if favorited | Yes |

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all categories | No |
| POST | `/categories` | Create category | Yes (Admin) |

## Deployment Guide

### Production Backend Deployment

1. **Build the application**
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables**
   - Use production database URL
   - Configure production Stripe keys
   - Set secure JWT secret

3. **Run migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the server**
   ```bash
   npm run start:prod
   # Or use PM2
   pm2 start dist/main.js --name mfu-backend
   ```

### Production Frontend Deployment

1. **Build the application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure production environment**
   - Set production API URL
   - Use production Stripe publishable key

3. **Deploy to hosting platform**
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - Or serve static files with nginx/apache

### Docker Production Deployment

```bash
# Build and run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Or build individual images
docker build -t mfu-backend ./backend
docker build -t mfu-frontend ./frontend
```

### Environment Setup for Production

- Use managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
- Configure SSL/TLS certificates
- Set up proper CORS policies
- Implement rate limiting
- Configure monitoring and logging

## Usage Examples

### User Registration and Login
```javascript
// Register as a seller
const registerData = {
  name: "John Doe",
  email: "john@example.com",
  password: "securepassword",
  role: "SELLER"
};

fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registerData)
});

// Login
const loginData = {
  email: "john@example.com",
  password: "securepassword"
};

fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
}).then(res => res.json()).then(data => {
  localStorage.setItem('token', data.access_token);
});
```

### Creating a Product Listing
```javascript
const productData = {
  title: "Vintage Guitar",
  description: "Well-maintained acoustic guitar",
  price: 299.99,
  categoryId: 3
};

fetch('/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(productData)
});
```

### Searching Products
```javascript
// Search for "guitar" in electronics category, price 100-500
fetch('/products?search=guitar&category=3&minPrice=100&maxPrice=500&page=1&limit=20')
  .then(res => res.json())
  .then(products => console.log(products));
```

### Adding to Cart and Checkout
```javascript
// Add item to cart
const cartItem = {
  productId: 123,
  quantity: 1
};

fetch('/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(cartItem)
});

// Create order
fetch('/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ /* order data */ })
});
```

### Managing Reviews
```javascript
// Get product reviews
fetch('/reviews/products/123')
  .then(res => res.json())
  .then(reviews => console.log(reviews));

// Submit a review
const reviewData = {
  rating: 5,
  comment: "Great product, fast shipping!"
};

fetch('/reviews/products/123', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(reviewData)
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting and formatting
- Update documentation for API changes

## Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:cov  # With coverage
npm run test:e2e  # End-to-end tests
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env
   - Run `npx prisma migrate dev`

2. **Authentication issues**
   - Verify JWT_SECRET is set
   - Check token expiration (default: 24h)

3. **Payment processing errors**
   - Verify Stripe keys are correct
   - Check webhook endpoints are configured

4. **Image upload failures**
   - Confirm Cloudinary credentials
   - Check file size limits

### Useful Commands

```bash
# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# View database in browser
npx prisma studio

# Seed database (if available)
npx prisma db seed
```

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For questions or support, please open an issue in the GitHub repository or contact the development team.
#   m f u - 2 n d h a n d  
 