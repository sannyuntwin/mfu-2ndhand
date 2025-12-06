import { api } from "./api";

export const categoryService = {
  // Get all categories
  getAll: () => api.get('/categories'),

  // Get a single category by id
  getById: (id: number) => api.get(`/categories/${id}`),

  // Create a new category (admin only)
  create: (data: any) => api.post('/admin/categories', data),

  // Update a category (admin only)
  update: (id: number, data: any) => api.put(`/admin/categories/${id}`, data),

  // Delete a category (admin only)
  delete: (id: number) => api.delete(`/admin/categories/${id}`),
};