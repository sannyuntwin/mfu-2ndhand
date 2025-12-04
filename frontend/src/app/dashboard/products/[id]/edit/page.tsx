'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '../../../../../utils/api';
import AuthGuard from '../../../../../components/common/auth-guard';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryId?: number;
  imageUrls: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrls: ['']
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const product = await apiClient.getProduct(productId);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.category?.id?.toString() || '',
        imageUrls: product.images?.map((img: {url: string}) => img.url) || ['']
      });
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product');
      router.push('/dashboard/products');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        imageUrls: formData.imageUrls.filter(url => url.trim() !== '')
      };

      await apiClient.updateProduct(productId, productData);
      router.push('/dashboard/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      setErrors({ general: 'Failed to update product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, '']
    }));
  };

  const updateImageUrl = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => i === index ? value : url)
    }));
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  if (fetching) {
    return (
      <AuthGuard sellerOnly>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading product...</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard sellerOnly>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update your product information</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Product Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your product in detail"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="1">Electronics</option>
                  <option value="2">Clothing</option>
                  <option value="3">Home & Garden</option>
                  <option value="4">Sports & Outdoors</option>
                  <option value="5">Books & Media</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images
                </label>
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Image URL
                </button>
              </div>
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImageUrl(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 border border-gray-300 rounded-md hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-1">
                Add image URLs for your product. The first image will be used as the main product image.
              </p>
            </div>

            <div className="flex space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating Product...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}