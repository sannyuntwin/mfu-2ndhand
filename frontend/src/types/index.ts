export interface User {
  id: number;
  name: string;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  sellerId: number;
  categoryId?: number;
  createdAt: string;
  seller: Partial<User>;
  category?: Category;
  images: ProductImage[];
  reviews?: Review[];
}

export interface ProductImage {
  id: number;
  url: string;
  productId: number;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  products: Product[];
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
  product: Product;
}

export interface Cart {
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  buyerId: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
  buyer: User;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}