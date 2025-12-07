'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productService } from '@/services/product.service';
import { categoryService } from '@/services/category.service';
import AuthGuard from '@/components/common/auth-guard';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrls: ['']
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load product and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [product, cats] = await Promise.all([
          productService.getById(productId),
          categoryService.getAll()
        ]);

        setFormData({
          title: product.title,
          description: product.description,
          price: product.price.toString(),
          categoryId: product.category?.id?.toString() || '',
          imageUrls: product.images?.map((img: { url: string }) => img.url) || ['']
        });

        setCategories(cats || []);
      } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product');
        router.push('/dashboard/products');
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [productId]);

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
        images: formData.imageUrls.filter(url => url.trim() !== '')
      };

      await productService.update(productId, productData);
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      setErrors({ general: 'Failed to update product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
  const updateImageUrl = (i: number, val: string) =>
    setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.map((url, idx) => idx === i ? val : url) }));
  const removeImageUrl = (i: number) =>
    setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, idx) => idx !== i) }));

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600 mb-6">Update your product information</p>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (฿) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Product Images</label>
                <button type="button" onClick={addImageUrl} className="text-blue-600 text-sm">
                  + Add Image
                </button>
              </div>
              {formData.imageUrls.map((url, i) => (
                <div key={i} className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={url}
                    onChange={e => updateImageUrl(i, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.imageUrls.length > 1 && (
                    <button type="button" onClick={() => removeImageUrl(i)} className="px-3 py-2 text-red-600">
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex space-x-4 pt-6 border-t">
              <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-md">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
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
