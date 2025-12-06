import { api } from "./api";

export const productService = {
  // Get all products with optional query parameters
  getAll: (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return api.get(`/products${query}`);
  },

  // Get featured products
  getFeatured: () => api.get("/products?featured=true"),

  // Get a single product by id
  getById: (id: number) => api.get(`/products/${id}`),

  // Seller: Create a new product
  create: (data: any) => api.post('/seller/products', data),

  // Seller: Update a product
  update: (id: number, data: any) => api.put(`/seller/products/${id}`, data),

  // Seller: Delete a product
  delete: (id: number) => api.delete(`/seller/products/${id}`),

  // Seller: Get my products
  getMyProducts: () => api.get('/seller/products'),
};
