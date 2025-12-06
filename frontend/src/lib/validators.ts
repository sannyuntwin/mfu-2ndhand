import { z } from 'zod'

// User schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['BUYER', 'SELLER']),
})

// Product schemas
export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url().optional(),
})

// Order schemas
export const orderSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().positive(),
  shippingAddress: z.string().optional(),
})