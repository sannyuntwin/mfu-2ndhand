import { Product, ProductsResponse, Category, Cart, Order, Review, User, SearchParams } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): { Authorization?: string } {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  }

  // Auth
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Products
  async getProducts(params?: {
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ProductsResponse> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request<ProductsResponse>(`/api/products?${queryString}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: number, productData: any) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: number) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request('/categories');
  }

  // Cart
  async getCart(): Promise<Cart> {
    return this.request('/cart');
  }

  async addToCart(productId: number, quantity: number = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(cartItemId: number, quantity: number) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(cartItemId: number) {
    return this.request(`/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return this.request('/orders');
  }

  async getOrder(id: number): Promise<Order> {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(id: number) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // Reviews
  async getProductReviews(productId: number): Promise<Review[]> {
    return this.request(`/reviews/product/${productId}`);
  }

  async createReview(reviewData: { productId: number; rating: number; comment?: string }) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Favorites/Wishlist
  async getFavorites() {
    return this.request('/favorites');
  }

  async addToFavorites(productId: number) {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromFavorites(productId: number) {
    return this.request(`/favorites/${productId}`, {
      method: 'DELETE',
    });
  }

  // User Profile
  async getProfile(): Promise<User> {
    return this.request('/users/profile');
  }

  async updateProfile(profileData: any) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
}

export const apiClient = new ApiClient();